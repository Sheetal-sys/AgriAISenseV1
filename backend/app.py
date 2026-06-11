from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from agents.disease_detection_agent import predict_disease
from agents.recommendation_agent import get_recommendation
import shutil
from pathlib import Path
import uuid
from PIL import Image
import cv2
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AgriAI Disease Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE_MB = 8
CONFIDENCE_THRESHOLD = 80
BLUR_THRESHOLD = 50


def validate_image_file(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG images are supported."
        )


def check_image_readable(image_path: Path):
    try:
        img = Image.open(image_path)
        img.verify()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid readable image."
        )


def check_blur_score(image_path: Path):
    image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)

    if image is None:
        return 0

    score = cv2.Laplacian(image, cv2.CV_64F).var()
    return round(float(score), 2)


def check_brightness_score(image_path: Path):
    image = cv2.imread(str(image_path))

    if image is None:
        return 0

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    brightness = hsv[:, :, 2].mean()
    return round(float(brightness), 2)


def get_confidence_level(confidence: float):
    if confidence >= 90:
        return "High"
    elif confidence >= 75:
        return "Medium"
    else:
        return "Low"


@app.get("/")
def home():
    return {"message": "AgriAI Disease Detection API is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    logger.info("Image received for prediction")

    validate_image_file(file)

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size_mb = file_path.stat().st_size / (1024 * 1024)

    if file_size_mb > MAX_FILE_SIZE_MB:
        file_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_MB} MB."
        )

    check_image_readable(file_path)

    blur_score = check_blur_score(file_path)
    brightness_score = check_brightness_score(file_path)

    if blur_score < BLUR_THRESHOLD:
        return {
            "status": "poor_quality",
            "message": "Image appears blurry. Please retake the photo closer to the leaf with better focus.",
            "blur_score": blur_score,
            "brightness_score": brightness_score
        }

    prediction = predict_disease(file_path)
    recommendation = get_recommendation(prediction["class_name"])

    confidence = prediction["confidence"]
    confidence_level = get_confidence_level(confidence)

    final_result = {
        **prediction,
        **recommendation,
        "status": "success",
        "message": "Disease detected successfully.",
        "confidence_level": confidence_level,
        "blur_score": blur_score,
        "brightness_score": brightness_score
    }

    if confidence < CONFIDENCE_THRESHOLD:
        final_result["status"] = "uncertain"
        final_result["message"] = (
            "Disease identified with lower confidence. "
            "For improved accuracy, capture a close-up image showing more of the affected leaf area."
        )

    logger.info(f"Prediction completed: {final_result}")

    return final_result
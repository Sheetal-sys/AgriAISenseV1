from database import (
    save_prediction,
    get_prediction_history,
    get_dashboard_analytics,
    get_dashboard_charts,
    update_prediction_feedback
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from agents.disease_detection_agent import predict_disease
from agents.recommendation_agent import get_recommendation
from report_generator import generate_prediction_report
import shutil
from pathlib import Path
import uuid
from PIL import Image
import cv2
import logging
import re

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


def safe_filename(value: str):
    value = value or "report"
    value = re.sub(r"[^a-zA-Z0-9_-]", "_", value)
    return value[:80]


@app.get("/")
def home():
    return {"message": "AgriAI Disease Detection API is running"}


@app.get("/history")
def get_history(page: int = 1, limit: int = 10):
    return get_prediction_history(page=page, limit=limit)


@app.get("/analytics")
def get_analytics():
    return get_dashboard_analytics()


@app.get("/analytics/charts")
def get_analytics_charts():
    return get_dashboard_charts()

@app.post("/feedback")
def submit_feedback(data: dict):
    prediction_id = data.get("prediction_id")
    feedback = data.get("feedback")

    if not prediction_id or feedback not in ["correct", "wrong"]:
        raise HTTPException(
            status_code=400,
            detail="prediction_id and valid feedback are required."
        )

    updated = update_prediction_feedback(prediction_id, feedback)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found or feedback not updated."
        )

    return {
        "message": "Feedback saved successfully.",
        "prediction_id": prediction_id,
        "feedback": feedback
    }

@app.post("/generate-report")
def generate_report(data: dict):
    pdf_buffer = generate_prediction_report(data)

    crop = safe_filename(data.get("crop", "crop"))
    disease = safe_filename(data.get("disease", "disease"))

    filename = f"AgriAI_Report_{crop}_{disease}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


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

    prediction_id = save_prediction(file_path, final_result)

    final_result["_id"] = prediction_id
    final_result["feedback"] = None

    return final_result
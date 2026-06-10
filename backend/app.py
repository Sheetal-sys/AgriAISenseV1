from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from agents.disease_detection_agent import predict_disease
from agents.recommendation_agent import get_recommendation
import shutil
from pathlib import Path
import uuid

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


@app.get("/")
def home():
    return {"message": "AgriAI Disease Detection API is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction = predict_disease(file_path)
    recommendation = get_recommendation(prediction["class_name"])

    return {
        **prediction,
        **recommendation
    }
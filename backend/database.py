import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "agri_ai")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "predictions")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]
predictions_collection = db[MONGO_COLLECTION_NAME]


def save_prediction(image_path, result):
    document = {
        "image_path": str(image_path),
        "crop": result.get("crop"),
        "disease": result.get("disease"),
        "class_name": result.get("class_name"),
        "confidence": result.get("confidence"),
        "confidence_level": result.get("confidence_level"),
        "severity": result.get("severity"),
        "status": result.get("status"),
        "message": result.get("message"),
        "blur_score": result.get("blur_score"),
        "brightness_score": result.get("brightness_score"),
        "cause": result.get("cause"),
        "symptoms": result.get("symptoms"),
        "treatment": result.get("treatment"),
        "prevention": result.get("prevention"),
        "created_at": datetime.now(timezone.utc)
    }

    predictions_collection.insert_one(document)


def get_prediction_history(page=1, limit=10):
    page = max(page, 1)
    limit = min(max(limit, 1), 50)
    skip = (page - 1) * limit

    total = predictions_collection.count_documents({})

    records = (
        predictions_collection
        .find()
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    items = []

    for record in records:
        record["_id"] = str(record["_id"])
        record["created_at"] = record["created_at"].isoformat()
        items.append(record)

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "has_more": page * limit < total
    }
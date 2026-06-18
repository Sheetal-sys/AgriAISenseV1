import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "agri_ai")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "predictions")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

predictions_collection = db[MONGO_COLLECTION_NAME]
feedback_collection = db["feedback"]


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
        "model_version": result.get("model_version"),
        "model_type": result.get("model_type"),
        "model_accuracy": result.get("model_accuracy"),
        "feedback": None,
        "feedback_created_at": None,
        "created_at": datetime.now(timezone.utc)
    }

    inserted = predictions_collection.insert_one(document)
    return str(inserted.inserted_id)


def update_prediction_feedback(prediction_id, feedback):
    if feedback not in ["correct", "wrong"]:
        return None

    prediction = predictions_collection.find_one(
        {"_id": ObjectId(prediction_id)}
    )

    if not prediction:
        return None

    feedback_time = datetime.now(timezone.utc)

    predictions_collection.update_one(
        {"_id": ObjectId(prediction_id)},
        {
            "$set": {
                "feedback": feedback,
                "feedback_created_at": feedback_time
            }
        }
    )

    feedback_document = {
        "prediction_id": prediction_id,
        "crop": prediction.get("crop"),
        "predicted_disease": prediction.get("disease"),
        "class_name": prediction.get("class_name"),
        "confidence": prediction.get("confidence"),
        "confidence_level": prediction.get("confidence_level"),
        "severity": prediction.get("severity"),
        "status": prediction.get("status"),
        "model_version": prediction.get("model_version"),
        "model_type": prediction.get("model_type"),
        "feedback": feedback,
        "created_at": feedback_time
    }

    feedback_collection.update_one(
        {"prediction_id": prediction_id},
        {"$set": feedback_document},
        upsert=True
    )

    return {
        "prediction_id": prediction_id,
        "feedback": feedback,
        "feedback_created_at": feedback_time.isoformat()
    }


    feedback_document = {
        "prediction_id": prediction_id,
        "crop": prediction.get("crop"),
        "predicted_disease": prediction.get("disease"),
        "class_name": prediction.get("class_name"),
        "confidence": prediction.get("confidence"),
        "confidence_level": prediction.get("confidence_level"),
        "severity": prediction.get("severity"),
        "status": prediction.get("status"),
        "model_version": prediction.get("model_version"),
        "model_type": prediction.get("model_type"),
        "feedback": feedback,
        "created_at": feedback_time
    }

    feedback_collection.insert_one(feedback_document)

    return {
        "prediction_id": prediction_id,
        "feedback": feedback,
        "feedback_created_at": feedback_time.isoformat()
    }


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

        if record.get("feedback_created_at"):
            record["feedback_created_at"] = record["feedback_created_at"].isoformat()

        items.append(record)

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "has_more": page * limit < total
    }


def get_dashboard_analytics():
    total_scans = predictions_collection.count_documents({})

    healthy_leaves = predictions_collection.count_documents({
        "disease": {"$regex": "healthy", "$options": "i"}
    })

    diseased_leaves = total_scans - healthy_leaves

    avg_confidence_result = list(
        predictions_collection.aggregate([
            {
                "$group": {
                    "_id": None,
                    "avg_confidence": {"$avg": "$confidence"}
                }
            }
        ])
    )

    avg_confidence = 0

    if avg_confidence_result:
        avg_confidence = round(
            avg_confidence_result[0].get("avg_confidence", 0),
            2
        )

    top_disease_result = list(
        predictions_collection.aggregate([
            {
                "$match": {
                    "disease": {
                        "$not": {"$regex": "healthy", "$options": "i"}
                    }
                }
            },
            {
                "$group": {
                    "_id": "$disease",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 1}
        ])
    )

    top_crop_result = list(
        predictions_collection.aggregate([
            {
                "$group": {
                    "_id": "$crop",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 1}
        ])
    )

    feedback_correct = predictions_collection.count_documents({
    "feedback": "correct"
    })

    feedback_wrong = predictions_collection.count_documents({
    "feedback": "wrong"
     })

    return {
        "total_scans": total_scans,
        "healthy_leaves": healthy_leaves,
        "diseased_leaves": diseased_leaves,
        "average_confidence": avg_confidence,
        "top_disease": top_disease_result[0].get("_id", "N/A") if top_disease_result else "N/A",
        "top_disease_count": top_disease_result[0].get("count", 0) if top_disease_result else 0,
        "top_crop": top_crop_result[0].get("_id", "N/A") if top_crop_result else "N/A",
        "top_crop_count": top_crop_result[0].get("count", 0) if top_crop_result else 0,
        "feedback_correct": feedback_correct,
        "feedback_wrong": feedback_wrong
    }


def get_dashboard_charts():
    disease_distribution = list(
        predictions_collection.aggregate([
            {
                "$group": {
                    "_id": "$disease",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 8}
        ])
    )

    crop_distribution = list(
        predictions_collection.aggregate([
            {
                "$group": {
                    "_id": "$crop",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 8}
        ])
    )

    confidence_trend_records = list(
        predictions_collection
        .find({}, {"confidence": 1, "created_at": 1, "disease": 1})
        .sort("created_at", -1)
        .limit(20)
    )

    confidence_trend_records.reverse()

    confidence_trend = []

    for index, record in enumerate(confidence_trend_records, start=1):
        confidence_trend.append({
            "scan": index,
            "confidence": record.get("confidence", 0),
            "disease": record.get("disease", "N/A")
        })

    feedback_distribution = [
    {
        "name": "Correct",
        "count": predictions_collection.count_documents({"feedback": "correct"})
    },
    {
        "name": "Wrong",
        "count": predictions_collection.count_documents({"feedback": "wrong"})
    }
]
    

    return {
        "disease_distribution": [
            {
                "name": item.get("_id") or "Unknown",
                "count": item.get("count", 0)
            }
            for item in disease_distribution
        ],
        "crop_distribution": [
            {
                "name": item.get("_id") or "Unknown",
                "count": item.get("count", 0)
            }
            for item in crop_distribution
        ],
        "confidence_trend": confidence_trend,
        "feedback_distribution": feedback_distribution
    }
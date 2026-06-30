import certifi
import os
from datetime import datetime, timezone

from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "agri_ai")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "predictions")

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=5000
)

db = client[MONGO_DB_NAME]

predictions_collection = db[MONGO_COLLECTION_NAME]
feedback_collection = db["feedback"]


def serialize_prediction(record):
    record["_id"] = str(record["_id"])

    if record.get("created_at"):
        record["created_at"] = record["created_at"].isoformat()

    if record.get("feedback_created_at"):
        record["feedback_created_at"] = record["feedback_created_at"].isoformat()

    return record


def save_prediction(image_path, result, user_id):
    document = {
        "user_id": user_id,
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


def update_prediction_feedback(prediction_id, feedback, user_id=None):
    if feedback not in ["correct", "wrong"]:
        return None

    try:
        object_id = ObjectId(prediction_id)
    except Exception:
        return None

    query = {"_id": object_id}
    if user_id:
        query["user_id"] = user_id

    prediction = predictions_collection.find_one(query)

    if not prediction:
        return None

    feedback_time = datetime.now(timezone.utc)

    predictions_collection.update_one(
        query,
        {
            "$set": {
                "feedback": feedback,
                "feedback_created_at": feedback_time
            }
        }
    )

    feedback_document = {
        "prediction_id": prediction_id,
        "user_id": prediction.get("user_id"),
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
        {
            "prediction_id": prediction_id,
            "user_id": prediction.get("user_id")
        },
        {"$set": feedback_document},
        upsert=True
    )

    return {
        "prediction_id": prediction_id,
        "feedback": feedback,
        "feedback_created_at": feedback_time.isoformat()
    }


def get_prediction_history(
    user_id,
    page=1,
    limit=10,
    search="",
    crop="",
    status="",
    severity="",
    sort="-created_at"
):
    page = max(page, 1)
    limit = min(max(limit, 1), 50)
    skip = (page - 1) * limit

    query = {
        "user_id": user_id
    }

    if search:
        query["$or"] = [
            {"crop": {"$regex": search, "$options": "i"}},
            {"disease": {"$regex": search, "$options": "i"}},
            {"class_name": {"$regex": search, "$options": "i"}},
            {"status": {"$regex": search, "$options": "i"}},
            {"severity": {"$regex": search, "$options": "i"}},
        ]

    if crop:
        query["crop"] = {"$regex": f"^{crop}$", "$options": "i"}

    if status:
        query["status"] = {"$regex": f"^{status}$", "$options": "i"}

    if severity:
        query["severity"] = {"$regex": severity, "$options": "i"}

    sort_field = "created_at"
    sort_direction = -1

    if sort == "created_at":
        sort_direction = 1
    elif sort == "-confidence":
        sort_field = "confidence"
        sort_direction = -1
    elif sort == "confidence":
        sort_field = "confidence"
        sort_direction = 1

    total = predictions_collection.count_documents(query)

    records = (
        predictions_collection
        .find(query)
        .sort(sort_field, sort_direction)
        .skip(skip)
        .limit(limit)
    )

    items = [serialize_prediction(record) for record in records]

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "has_more": page * limit < total,
        "filters": {
            "search": search,
            "crop": crop,
            "status": status,
            "severity": severity,
            "sort": sort
        }
    }


def get_dashboard_analytics(user_id=None):
    query = {"user_id": user_id} if user_id else {}

    total_scans = predictions_collection.count_documents(query)

    healthy_leaves = predictions_collection.count_documents({
        **query,
        "disease": {"$regex": "healthy", "$options": "i"}
    })

    diseased_leaves = total_scans - healthy_leaves

    avg_confidence_result = list(
        predictions_collection.aggregate([
            {"$match": query},
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
                    **query,
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
            {"$match": query},
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
        **query,
        "feedback": "correct"
    })

    feedback_wrong = predictions_collection.count_documents({
        **query,
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


def get_dashboard_charts(user_id=None):
    query = {"user_id": user_id} if user_id else {}

    disease_distribution = list(
        predictions_collection.aggregate([
            {"$match": query},
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
            {"$match": query},
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
        .find(query, {"confidence": 1, "created_at": 1, "disease": 1})
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
            "count": predictions_collection.count_documents({
                **query,
                "feedback": "correct"
            })
        },
        {
            "name": "Wrong",
            "count": predictions_collection.count_documents({
                **query,
                "feedback": "wrong"
            })
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


def get_recent_predictions(user_id=None, limit=5):
    limit = min(max(limit, 1), 20)
    query = {"user_id": user_id} if user_id else {}

    records = (
        predictions_collection
        .find(query)
        .sort("created_at", -1)
        .limit(limit)
    )

    return [serialize_prediction(record) for record in records]


def get_history_summary(user_id=None):
    query = {"user_id": user_id} if user_id else {}
    analytics = get_dashboard_analytics(user_id=user_id)

    uncertain = predictions_collection.count_documents({
        **query,
        "status": "uncertain"
    })

    poor_quality = predictions_collection.count_documents({
        **query,
        "status": "poor_quality"
    })

    return {
        "total_predictions": analytics.get("total_scans", 0),
        "healthy": analytics.get("healthy_leaves", 0),
        "diseased": analytics.get("diseased_leaves", 0),
        "uncertain": uncertain,
        "poor_quality": poor_quality,
        "average_confidence": analytics.get("average_confidence", 0)
    }


def get_top_diseases(user_id=None, limit=5):
    limit = min(max(limit, 1), 10)
    query = {"user_id": user_id} if user_id else {}

    records = list(
        predictions_collection.aggregate([
            {
                "$match": {
                    **query,
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
            {"$limit": limit}
        ])
    )

    total_diseased = sum(item.get("count", 0) for item in records)

    return [
        {
            "name": item.get("_id") or "Unknown",
            "count": item.get("count", 0),
            "percentage": round(
                (item.get("count", 0) / total_diseased) * 100,
                2
            ) if total_diseased > 0 else 0
        }
        for item in records
    ]


def get_dashboard_full_data(user_id=None):
    analytics = get_dashboard_analytics(user_id=user_id)
    charts = get_dashboard_charts(user_id=user_id)
    recent_predictions = get_recent_predictions(user_id=user_id, limit=5)
    history_summary = get_history_summary(user_id=user_id)
    top_diseases = get_top_diseases(user_id=user_id, limit=5)

    return {
        "analytics": analytics,
        "charts": charts,
        "recent_predictions": recent_predictions,
        "history_summary": history_summary,
        "top_diseases": top_diseases,
        "system": {
            "api_status": "active",
            "database_status": "connected",
            "storage_status": "healthy",
            "ai_model_status": "running"
        }
    }
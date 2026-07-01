from datetime import datetime, timezone
from bson import ObjectId
from typing import Any

from database import db


notifications_collection = db["notifications"]


def serialize_notification(record):
    return {
        "notification_id": str(record["_id"]),
        "user_id": record.get("user_id"),
        "title": record.get("title"),
        "message": record.get("message"),
        "type": record.get("type", "system"),
        "is_read": record.get("is_read", False),
        "created_at": record.get("created_at").isoformat() if record.get("created_at") else None,
        "read_at": record.get("read_at").isoformat() if record.get("read_at") else None,
    }


def create_notification(user_id: str, title: str, message: str, notification_type: str = "system"):
    document = {
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": notification_type,
        "is_read": False,
        "created_at": datetime.now(timezone.utc),
        "read_at": None,
    }

    result = notifications_collection.insert_one(document)
    document["_id"] = result.inserted_id

    return serialize_notification(document)


def get_notifications(user_id: str, notification_type: str = "", unread_only: bool = False):
    query: dict[str, Any] = {
    "user_id": user_id
}

    if notification_type:
        query["type"] = notification_type

    if unread_only:
        query["is_read"] = False

    records = (
        notifications_collection
        .find(query)
        .sort("created_at", -1)
        .limit(100)
    )

    items = [serialize_notification(record) for record in records]
    unread_count = notifications_collection.count_documents({
        "user_id": user_id,
        "is_read": False
    })

    return {
        "items": items,
        "unread_count": unread_count,
        "total": len(items)
    }


def mark_notification_read(user_id: str, notification_id: str):
    try:
        object_id = ObjectId(notification_id)
    except Exception:
        return None

    result = notifications_collection.update_one(
        {
            "_id": object_id,
            "user_id": user_id
        },
        {
            "$set": {
                "is_read": True,
                "read_at": datetime.now(timezone.utc)
            }
        }
    )

    if result.matched_count == 0:
        return None

    record = notifications_collection.find_one({
        "_id": object_id,
        "user_id": user_id
    })

    return serialize_notification(record)


def mark_all_notifications_read(user_id: str):
    notifications_collection.update_many(
        {
            "user_id": user_id,
            "is_read": False
        },
        {
            "$set": {
                "is_read": True,
                "read_at": datetime.now(timezone.utc)
            }
        }
    )

    return get_notifications(user_id)


def delete_notification(user_id: str, notification_id: str):
    try:
        object_id = ObjectId(notification_id)
    except Exception:
        return False

    result = notifications_collection.delete_one({
        "_id": object_id,
        "user_id": user_id
    })

    return result.deleted_count > 0


def clear_notifications(user_id: str):
    result = notifications_collection.delete_many({
        "user_id": user_id
    })

    return {
        "deleted_count": result.deleted_count
    }
from datetime import datetime, timezone
from database import db

DEFAULT_USER_ID = "demo-user-rajesh"

users_collection = db["users"]
settings_collection = db["user_settings"]
notifications_collection = db["notifications"]


def get_user_profile():
    profile = users_collection.find_one({"user_id": DEFAULT_USER_ID}, {"_id": 0})

    if profile:
        return profile

    default_profile = {
        "user_id": DEFAULT_USER_ID,
        "name": "Rajesh Kumar",
        "role": "Farmer / AgriAI User",
        "location": "Indore, Madhya Pradesh, India",
        "email": "rajesh.kumar@example.com",
        "phone": "+91 98765 43210",
        "active_module": "Disease Detection",
        "member_since": "May 2024",
        "created_at": datetime.now(timezone.utc)
    }

    users_collection.insert_one(default_profile)
    default_profile.pop("_id", None)
    return default_profile


def update_user_profile(data: dict):
    users_collection.update_one(
        {"user_id": DEFAULT_USER_ID},
        {"$set": data},
        upsert=True
    )

    return get_user_profile()


def get_user_settings():
    settings = settings_collection.find_one({"user_id": DEFAULT_USER_ID}, {"_id": 0})

    if settings:
        return settings

    default_settings = {
        "user_id": DEFAULT_USER_ID,
        "theme": "dark",
        "language": "English",
        "notifications_enabled": True,
        "anonymous_analytics": True,
        "created_at": datetime.now(timezone.utc)
    }

    settings_collection.insert_one(default_settings)
    default_settings.pop("_id", None)
    return default_settings


def update_user_settings(data: dict):
    settings_collection.update_one(
        {"user_id": DEFAULT_USER_ID},
        {"$set": data},
        upsert=True
    )

    return get_user_settings()


def get_notifications():
    existing_count = notifications_collection.count_documents({
        "user_id": DEFAULT_USER_ID
    })

    if existing_count == 0:
        default_notifications = [
            {
                "user_id": DEFAULT_USER_ID,
                "title": "Disease detection API is active",
                "type": "system",
                "status": "active",
                "read": False,
                "created_at": datetime.now(timezone.utc)
            },
            {
                "user_id": DEFAULT_USER_ID,
                "title": "MongoDB Atlas connected successfully",
                "type": "database",
                "status": "connected",
                "read": False,
                "created_at": datetime.now(timezone.utc)
            },
            {
                "user_id": DEFAULT_USER_ID,
                "title": "Weather risk agent coming soon",
                "type": "module",
                "status": "upcoming",
                "read": False,
                "created_at": datetime.now(timezone.utc)
            }
        ]

        notifications_collection.insert_many(default_notifications)

    records = notifications_collection.find(
        {"user_id": DEFAULT_USER_ID},
        {"_id": 0}
    ).sort("created_at", -1)

    return list(records)


def mark_notifications_read():
    notifications_collection.update_many(
        {"user_id": DEFAULT_USER_ID},
        {"$set": {"read": True}}
    )

    return {
        "message": "Notifications marked as read",
        "notifications": get_notifications()
    }
from datetime import datetime, timezone

from database import db


settings_collection = db["user_settings"]


DEFAULT_SETTINGS = {
    "theme": "dark",
    "language": "English",
    "measurement_unit": "metric",

    "notifications_enabled": True,
    "disease_alerts": True,
    "weather_alerts": True,
    "report_notifications": True,

    "anonymous_analytics": True,
    "store_history": True,

    "confidence_threshold": 80,
}


def get_settings(user_id: str):
    settings = settings_collection.find_one(
        {"user_id": user_id},
        {"_id": 0}
    )

    if settings:
        return settings

    default_settings = {
        "user_id": user_id,
        **DEFAULT_SETTINGS,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    settings_collection.insert_one(default_settings)

    default_settings.pop("_id", None)
    return default_settings


def update_settings(user_id: str, data: dict):
    allowed_fields = set(DEFAULT_SETTINGS.keys())

    update_data = {
        key: value
        for key, value in data.items()
        if key in allowed_fields and value is not None
    }

    update_data["updated_at"] = datetime.now(timezone.utc)

    settings_collection.update_one(
        {"user_id": user_id},
        {
            "$set": update_data,
            "$setOnInsert": {
                "user_id": user_id,
                "created_at": datetime.now(timezone.utc),
            },
        },
        upsert=True
    )

    return get_settings(user_id)
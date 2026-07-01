from datetime import datetime, timezone
from bson import ObjectId

from database import db


users_collection = db["users"]


def get_profile(user_id: str):
    try:
        object_id = ObjectId(user_id)
    except Exception:
        return None

    user = users_collection.find_one({"_id": object_id})

    if not user:
        return None

    return serialize_profile(user)


def update_profile(user_id: str, data: dict):
    try:
        object_id = ObjectId(user_id)
    except Exception:
        return None

    allowed_fields = {
        "name",
        "phone",
        "location",
        "role",
        "farm_name",
        "farm_size",
        "primary_crops",
        "experience",
        "language",
    }

    update_data = {
        key: value
        for key, value in data.items()
        if key in allowed_fields and value is not None
    }

    update_data["updated_at"] = datetime.now(timezone.utc)

    users_collection.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )

    return get_profile(user_id)


def serialize_profile(user):
    return {
        "user_id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone"),
        "role": user.get("role", "Farmer"),
        "location": user.get("location"),
        "farm_name": user.get("farm_name"),
        "farm_size": user.get("farm_size"),
        "primary_crops": user.get("primary_crops", []),
        "experience": user.get("experience"),
        "language": user.get("language", "English"),
        "created_at": user.get("created_at").isoformat() if user.get("created_at") else None,
        "updated_at": user.get("updated_at").isoformat() if user.get("updated_at") else None,
        "last_login": user.get("last_login").isoformat() if user.get("last_login") else None,
    }
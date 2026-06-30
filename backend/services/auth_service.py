from datetime import datetime, timezone
from bson import ObjectId

from database import db
from utils.security import hash_password, verify_password, create_access_token


users_collection = db["users"]


def serialize_user(user):
    return {
        "user_id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role", "Farmer"),
        "phone": user.get("phone"),
        "location": user.get("location"),
    }


def register_user(data):
    existing_user = users_collection.find_one({
        "email": data.email.lower()
    })

    if existing_user:
        return None, "Email already registered."

    user_document = {
        "name": data.name,
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "phone": data.phone,
        "location": data.location,
        "role": data.role,
        "created_at": datetime.now(timezone.utc),
        "last_login": None,
        "is_active": True,
    }

    result = users_collection.insert_one(user_document)
    user_document["_id"] = result.inserted_id

    user = serialize_user(user_document)

    token = create_access_token({
        "sub": user["user_id"],
        "email": user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }, None


def login_user(username: str, password: str):
    user_record = users_collection.find_one({
        "email": username.lower()
    })

    if not user_record:
        return None, "Invalid email or password."

    if not verify_password(password, user_record.get("password_hash", "")):
        return None, "Invalid email or password."

    users_collection.update_one(
        {"_id": user_record["_id"]},
        {
            "$set": {
                "last_login": datetime.now(timezone.utc)
            }
        }
    )

    user = serialize_user(user_record)

    token = create_access_token({
        "sub": user["user_id"],
        "email": user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }, None

def get_user_by_id(user_id):
    try:
        object_id = ObjectId(user_id)
    except Exception:
        return None

    user_record = users_collection.find_one({
        "_id": object_id,
        "is_active": True
    })

    if not user_record:
        return None

    return serialize_user(user_record)
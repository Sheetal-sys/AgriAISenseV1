from pydantic import BaseModel, EmailStr, Field


class ProfileUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=80)
    phone: str | None = None
    location: str | None = None
    role: str | None = None

    farm_name: str | None = None
    farm_size: str | None = None
    primary_crops: list[str] | None = None
    experience: int | None = Field(None, ge=0, le=80)
    language: str | None = None


class ProfileResponse(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    phone: str | None = None
    role: str | None = None
    location: str | None = None

    farm_name: str | None = None
    farm_size: str | None = None
    primary_crops: list[str] | None = None
    experience: int | None = None
    language: str | None = None
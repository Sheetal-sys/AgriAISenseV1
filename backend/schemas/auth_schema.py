from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    phone: str | None = None
    location: str | None = None
    role: str = "Farmer"


class AuthUserResponse(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    role: str
    phone: str | None = None
    location: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse
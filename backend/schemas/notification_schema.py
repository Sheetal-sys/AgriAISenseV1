from pydantic import BaseModel, Field


class NotificationCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    message: str = Field(..., min_length=3)
    type: str = Field(default="system", max_length=30)


class NotificationResponse(BaseModel):
    notification_id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: str
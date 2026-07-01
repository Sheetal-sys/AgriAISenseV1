from pydantic import BaseModel, Field


class SettingsUpdateRequest(BaseModel):
    theme: str | None = Field(None, max_length=30)
    language: str | None = Field(None, max_length=50)
    measurement_unit: str | None = Field(None, max_length=20)

    notifications_enabled: bool | None = None
    disease_alerts: bool | None = None
    weather_alerts: bool | None = None
    report_notifications: bool | None = None

    anonymous_analytics: bool | None = None
    store_history: bool | None = None

    confidence_threshold: int | None = Field(None, ge=50, le=99)
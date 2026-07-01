from fastapi import APIRouter, Depends

from routers.auth import get_current_user
from schemas.settings_schema import SettingsUpdateRequest
from services.settings_service import get_settings, update_settings


router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)


@router.get("")
def settings_get(current_user: dict = Depends(get_current_user)):
    return get_settings(current_user["user_id"])


@router.put("")
def settings_update(
    data: SettingsUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    return update_settings(
        current_user["user_id"],
        data.model_dump(exclude_unset=True)
    )
from fastapi import APIRouter, Depends, HTTPException

from routers.auth import get_current_user
from schemas.profile_schema import ProfileUpdateRequest
from services.profile_service import get_profile, update_profile


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("")
def profile_get(current_user: dict = Depends(get_current_user)):
    profile = get_profile(current_user["user_id"])

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found."
        )

    return profile


@router.put("")
def profile_update(
    data: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    updated_profile = update_profile(
        current_user["user_id"],
        data.model_dump(exclude_unset=True)
    )

    if not updated_profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found or update failed."
        )

    return updated_profile
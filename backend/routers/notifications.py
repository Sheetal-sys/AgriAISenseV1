from fastapi import APIRouter, Depends, HTTPException, Query

from routers.auth import get_current_user
from services.notification_service import (
    create_notification,
    get_notifications,
    mark_notification_read,
    mark_all_notifications_read,
    delete_notification,
    clear_notifications,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get("")
def notifications_get(
    notification_type: str = Query(default=""),
    unread_only: bool = Query(default=False),
    current_user: dict = Depends(get_current_user),
):
    return get_notifications(
        current_user["user_id"],
        notification_type,
        unread_only,
    )


@router.post("/test")
def create_test_notification(
    current_user: dict = Depends(get_current_user),
):
    """
    Temporary endpoint.
    We'll remove this later once notifications
    are created automatically by backend events.
    """

    return create_notification(
        user_id=current_user["user_id"],
        title="Welcome to AgriAI",
        message="Your notification system is working successfully.",
        notification_type="system",
    )


@router.put("/{notification_id}/read")
def notification_mark_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    notification = mark_notification_read(
        current_user["user_id"],
        notification_id,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    return notification


@router.put("/read-all")
def notification_mark_all_read(
    current_user: dict = Depends(get_current_user),
):
    return mark_all_notifications_read(
        current_user["user_id"]
    )


@router.delete("/{notification_id}")
def notification_delete(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    deleted = delete_notification(
        current_user["user_id"],
        notification_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    return {
        "message": "Notification deleted successfully."
    }


@router.delete("")
def notification_clear(
    current_user: dict = Depends(get_current_user),
):
    return clear_notifications(
        current_user["user_id"]
    )
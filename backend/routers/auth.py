from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from schemas.auth_schema import RegisterRequest
from services.auth_service import register_user, login_user, get_user_by_id
from utils.security import decode_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload."
        )

    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found or inactive."
        )

    return user


@router.post("/register")
def register(data: RegisterRequest):
    result, error = register_user(data)

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return result


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    result, error = login_user(
        form_data.username,
        form_data.password
    )

    if error:
        raise HTTPException(
            status_code=401,
            detail=error
        )

    return result


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user
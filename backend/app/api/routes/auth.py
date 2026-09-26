from fastapi import APIRouter

from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    user = {"email": payload.email, "name": "Laura Méndez", "role": "Administrador"}
    return TokenResponse(access_token=create_access_token(payload.email), user=user)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.models.security import User
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if len(settings.jwt_secret_key) < 32:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="JWT_SECRET_KEY no está configurada correctamente.",
        )
    user = db.scalar(
        select(User)
        .options(joinedload(User.role))
        .where(User.email == payload.email, User.is_active.is_(True))
    )
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
        )
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user={"email": user.email, "name": user.full_name, "role": user.role.name},
    )

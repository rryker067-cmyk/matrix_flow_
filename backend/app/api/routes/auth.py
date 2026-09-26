from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.security import Role, User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

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


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if len(settings.jwt_secret_key) < 32:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="JWT_SECRET_KEY no está configurada correctamente.",
        )

    existing_user = db.scalar(
        select(User.id).where(func.lower(User.email) == payload.email)
    )
    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya existe una cuenta con ese correo.")

    role = db.scalar(select(Role).where(Role.name == "member"))
    if role is None:
        role = Role(name="member", description="Usuario registrado")
        db.add(role)
        db.flush()

    user = User(
        role_id=role.id,
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo.",
        ) from error
    db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user={"email": user.email, "name": user.full_name, "role": role.name},
    )

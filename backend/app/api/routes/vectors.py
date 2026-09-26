from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.repositories.api_record_repository import api_record_repository
from app.schemas.vector import Vector, VectorCreate

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[Vector])
def list_vectors(db: Session = Depends(get_db)) -> list[dict]:
    return api_record_repository.list(db, "vectors")


@router.post("", response_model=Vector, status_code=status.HTTP_201_CREATED)
def create_vector(payload: VectorCreate, db: Session = Depends(get_db)) -> dict:
    return api_record_repository.create(
        db, "vectors", {**payload.model_dump(), "dimension": len(payload.values)}
    )

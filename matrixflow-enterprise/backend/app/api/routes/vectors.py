from fastapi import APIRouter, status

from app.repositories.memory_store import store
from app.schemas.vector import Vector, VectorCreate

router = APIRouter()


@router.get("", response_model=list[Vector])
def list_vectors() -> list[dict]:
    return store.vectors


@router.post("", response_model=Vector, status_code=status.HTTP_201_CREATED)
def create_vector(payload: VectorCreate) -> dict:
    return store.add("vectors", {**payload.model_dump(), "dimension": len(payload.values)})

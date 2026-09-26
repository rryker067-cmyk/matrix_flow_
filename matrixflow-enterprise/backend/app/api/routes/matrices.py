from fastapi import APIRouter, status

from app.repositories.memory_store import store
from app.schemas.matrix import Matrix, MatrixCreate

router = APIRouter()


@router.get("", response_model=list[Matrix])
def list_matrices() -> list[dict]:
    return store.matrices


@router.post("", response_model=Matrix, status_code=status.HTTP_201_CREATED)
def create_matrix(payload: MatrixCreate) -> dict:
    return store.add("matrices", {**payload.model_dump(), "rows": len(payload.values), "columns": len(payload.values[0])})

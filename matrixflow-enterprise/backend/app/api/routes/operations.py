from fastapi import APIRouter, HTTPException

from app.core.exceptions import DomainError
from app.repositories.memory_store import store
from app.schemas.operation import OperationRequest, OperationResponse
from app.services.operation_service import execute_operation

router = APIRouter()


@router.get("", response_model=list[OperationResponse])
def list_operations() -> list[dict]:
    return store.operations


@router.post("", response_model=OperationResponse)
def run_operation(payload: OperationRequest) -> dict:
    try:
        return execute_operation(payload)
    except (DomainError, TypeError, ValueError) as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

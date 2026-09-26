from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import DomainError
from app.core.security import get_current_user
from app.repositories.api_record_repository import api_record_repository
from app.schemas.operation import OperationRequest, OperationResponse
from app.services.operation_service import execute_operation

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[OperationResponse])
def list_operations(db: Session = Depends(get_db)) -> list[dict]:
    return api_record_repository.list(db, "operations")


@router.post("", response_model=OperationResponse)
def run_operation(payload: OperationRequest, db: Session = Depends(get_db)) -> dict:
    try:
        return execute_operation(payload, db)
    except (DomainError, TypeError, ValueError) as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.branch import Branch, BranchCreate
from app.services.branch_service import create_branch, list_branches

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[Branch])
def get_branches(db: Session = Depends(get_db)) -> list[Branch]:
    return list_branches(db)


@router.post("", response_model=Branch, status_code=status.HTTP_201_CREATED)
def post_branch(payload: BranchCreate, db: Session = Depends(get_db)) -> Branch:
    return create_branch(db, payload)
from fastapi import APIRouter, status

from app.schemas.branch import Branch, BranchCreate
from app.services.branch_service import create_branch, list_branches

router = APIRouter()


@router.get("", response_model=list[Branch])
def get_branches() -> list[Branch]:
    return list_branches()


@router.post("", response_model=Branch, status_code=status.HTTP_201_CREATED)
def post_branch(payload: BranchCreate) -> Branch:
    return create_branch(payload)
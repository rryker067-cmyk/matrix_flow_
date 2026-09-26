from app.repositories.branch_repository import branch_repository
from app.schemas.branch import Branch, BranchCreate


def list_branches() -> list[Branch]:
    return [Branch.model_validate(branch) for branch in branch_repository.list()]


def create_branch(payload: BranchCreate) -> Branch:
    branch = branch_repository.create(payload.model_dump())
    return Branch.model_validate(branch)
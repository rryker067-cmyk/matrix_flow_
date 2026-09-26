from typing import Any

from app.repositories.memory_store import store


class BranchRepository:
    def list(self) -> list[dict[str, Any]]:
        return store.branches

    def create(self, data: dict[str, Any]) -> dict[str, Any]:
        return store.add("branches", data)


branch_repository = BranchRepository()
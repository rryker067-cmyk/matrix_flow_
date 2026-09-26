from typing import Any

from app.repositories.memory_store import store


class CompanyRepository:
    def list(self) -> list[dict[str, Any]]:
        return store.companies

    def create(self, data: dict[str, Any]) -> dict[str, Any]:
        return store.add("companies", data)


company_repository = CompanyRepository()
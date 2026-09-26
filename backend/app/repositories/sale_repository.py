from typing import Any

from app.repositories.memory_store import store


class SaleRepository:
    def list(self) -> list[dict[str, Any]]:
        return store.sales

    def create(self, data: dict[str, Any]) -> dict[str, Any]:
        return store.add("sales", data)


sale_repository = SaleRepository()
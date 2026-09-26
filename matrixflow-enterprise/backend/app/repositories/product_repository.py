from typing import Any

from app.repositories.memory_store import store


class ProductRepository:
    def list(self) -> list[dict[str, Any]]:
        return store.products

    def create(self, data: dict[str, Any]) -> dict[str, Any]:
        return store.add("products", data)


product_repository = ProductRepository()
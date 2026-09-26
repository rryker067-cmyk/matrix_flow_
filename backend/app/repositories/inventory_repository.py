from typing import Any

from app.repositories.memory_store import store


class InventoryRepository:
    def list(self) -> list[dict[str, Any]]:
        return store.inventory

    def create(self, data: dict[str, Any]) -> dict[str, Any]:
        return store.add("inventory", data)


inventory_repository = InventoryRepository()
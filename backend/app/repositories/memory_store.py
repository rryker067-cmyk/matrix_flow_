from typing import Any


class MemoryStore:
    def __init__(self) -> None:
        self.companies: list[dict[str, Any]] = []
        self.branches: list[dict[str, Any]] = []
        self.products: list[dict[str, Any]] = []
        self.sales: list[dict[str, Any]] = []
        self.inventory: list[dict[str, Any]] = []
        self.vectors: list[dict[str, Any]] = []
        self.matrices: list[dict[str, Any]] = []
        self.operations: list[dict[str, Any]] = []
        self._ids = {
            "companies": 0,
            "branches": 0,
            "products": 0,
            "sales": 0,
            "inventory": 0,
            "vectors": 0,
            "matrices": 0,
            "operations": 0,
        }

    def add(self, collection: str, item: dict[str, Any]) -> dict[str, Any]:
        self._ids[collection] += 1
        record = {"id": self._ids[collection], **item}
        getattr(self, collection).append(record)
        return record


store = MemoryStore()

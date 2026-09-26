from app.repositories.inventory_repository import inventory_repository
from app.schemas.inventory import Inventory, InventoryCreate


def list_inventory() -> list[Inventory]:
    return [Inventory.model_validate(item) for item in inventory_repository.list()]


def create_inventory_item(payload: InventoryCreate) -> Inventory:
    item = inventory_repository.create(payload.model_dump())
    return Inventory.model_validate(item)
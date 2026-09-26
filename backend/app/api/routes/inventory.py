from fastapi import APIRouter, status

from app.schemas.inventory import Inventory, InventoryCreate
from app.services.inventory_service import create_inventory_item, list_inventory

router = APIRouter()


@router.get("", response_model=list[Inventory])
def get_inventory() -> list[Inventory]:
    return list_inventory()


@router.post("", response_model=Inventory, status_code=status.HTTP_201_CREATED)
def post_inventory_item(payload: InventoryCreate) -> Inventory:
    return create_inventory_item(payload)
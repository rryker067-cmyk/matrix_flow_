from fastapi import APIRouter

from app.repositories.memory_store import store

router = APIRouter()


@router.get("")
def get_report() -> dict:
    return {
        "sales": {"current": 284920, "change_percent": 12.8},
        "inventory": {"valued": 1200000, "change_percent": -2.1},
        "operations": {"completed": len(store.operations)},
        "companies": len(store.companies),
        "branches": len(store.branches),
        "products": len(store.products),
        "sales_records": len(store.sales),
        "inventory_records": len(store.inventory),
        "vectors": len(store.vectors),
        "matrices": len(store.matrices),
    }

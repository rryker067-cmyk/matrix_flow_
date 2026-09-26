from fastapi import APIRouter, status

from app.schemas.sale import Sale, SaleCreate
from app.services.sale_service import create_sale, list_sales

router = APIRouter()


@router.get("", response_model=list[Sale])
def get_sales() -> list[Sale]:
    return list_sales()


@router.post("", response_model=Sale, status_code=status.HTTP_201_CREATED)
def post_sale(payload: SaleCreate) -> Sale:
    return create_sale(payload)
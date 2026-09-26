from fastapi import APIRouter, status

from app.schemas.product import Product, ProductCreate
from app.services.product_service import create_product, list_products

router = APIRouter()


@router.get("", response_model=list[Product])
def get_products() -> list[Product]:
    return list_products()


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
def post_product(payload: ProductCreate) -> Product:
    return create_product(payload)
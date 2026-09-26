from app.repositories.product_repository import product_repository
from app.schemas.product import Product, ProductCreate


def list_products() -> list[Product]:
    return [Product.model_validate(product) for product in product_repository.list()]


def create_product(payload: ProductCreate) -> Product:
    product = product_repository.create(payload.model_dump())
    return Product.model_validate(product)
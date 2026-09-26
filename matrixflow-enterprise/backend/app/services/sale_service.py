from app.repositories.sale_repository import sale_repository
from app.schemas.sale import Sale, SaleCreate


def list_sales() -> list[Sale]:
    return [Sale.model_validate(sale) for sale in sale_repository.list()]


def create_sale(payload: SaleCreate) -> Sale:
    sale = sale_repository.create(payload.model_dump())
    return Sale.model_validate(sale)
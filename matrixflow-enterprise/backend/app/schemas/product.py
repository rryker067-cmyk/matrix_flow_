from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=80)
    price: float = Field(ge=0)
    stock: int = Field(ge=0)


class Product(ProductCreate):
    id: int
    status: str = "active"
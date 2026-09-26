from pydantic import BaseModel, Field


class SaleCreate(BaseModel):
    code: str = Field(min_length=2, max_length=40)
    branch: str = Field(min_length=2, max_length=120)
    customer: str = Field(min_length=2, max_length=120)
    amount: float = Field(ge=0)
    status: str = Field(default="completed", min_length=2, max_length=30)


class Sale(SaleCreate):
    id: int
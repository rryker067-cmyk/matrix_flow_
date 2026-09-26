from typing import Literal

from pydantic import BaseModel, Field, field_validator


class UserSummary(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: str = Field(min_length=3, max_length=150)
    password: str = Field(min_length=12, max_length=128)
    role: Literal["member", "analyst", "viewer", "admin"] = "member"

    @field_validator("full_name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return " ".join(value.split())

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserUpdate(BaseModel):
    role: Literal["member", "analyst", "viewer", "admin"] | None = None
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=12, max_length=128)
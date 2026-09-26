from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.repositories.api_record_repository import api_record_repository
from app.schemas.branch import BranchCreate
from app.schemas.company import CompanyCreate
from app.schemas.inventory import InventoryCreate
from app.schemas.matrix import MatrixCreate
from app.schemas.product import ProductCreate
from app.schemas.sale import SaleCreate
from app.schemas.vector import VectorCreate

router = APIRouter(dependencies=[Depends(get_current_user)])
COLLECTIONS = {
    "companies", "branches", "products", "sales", "inventory",
    "vectors", "matrices", "operations",
}
PAYLOAD_MODELS = {
    "companies": CompanyCreate,
    "branches": BranchCreate,
    "products": ProductCreate,
    "sales": SaleCreate,
    "inventory": InventoryCreate,
    "vectors": VectorCreate,
    "matrices": MatrixCreate,
}


def validate_collection(collection: str) -> None:
    if collection not in COLLECTIONS:
        raise HTTPException(status_code=404, detail="Recurso no encontrado.")


def validate_payload(collection: str, payload: dict[str, Any]) -> dict[str, Any]:
    schema = PAYLOAD_MODELS.get(collection)
    if schema is None:
        raise HTTPException(status_code=405, detail="Este recurso solo admite lectura.")
    try:
        return schema.model_validate(payload).model_dump()
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=error.errors()) from error


@router.get("/{collection}")
def list_records(collection: str, db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    validate_collection(collection)
    return api_record_repository.list(db, collection)


@router.post("/{collection}", status_code=status.HTTP_201_CREATED)
def create_record(
    collection: str, payload: dict[str, Any], db: Session = Depends(get_db)
) -> dict[str, Any]:
    validate_collection(collection)
    payload.pop("id", None)
    validated_payload = validate_payload(collection, payload)
    if collection == "vectors":
        validated_payload["dimension"] = len(validated_payload["values"])
    if collection == "matrices":
        validated_payload["rows"] = len(validated_payload["values"])
        validated_payload["columns"] = len(validated_payload["values"][0])
    return api_record_repository.create(db, collection, validated_payload)


@router.put("/{collection}/{record_id}")
def update_record(
    collection: str,
    record_id: int,
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    validate_collection(collection)
    payload.pop("id", None)
    validated_payload = validate_payload(collection, payload)
    if collection == "vectors":
        validated_payload["dimension"] = len(validated_payload["values"])
    if collection == "matrices":
        validated_payload["rows"] = len(validated_payload["values"])
        validated_payload["columns"] = len(validated_payload["values"][0])
    updated = api_record_repository.update(db, collection, record_id, validated_payload)
    if updated is None:
        raise HTTPException(status_code=404, detail="Registro no encontrado.")
    return updated


@router.delete("/{collection}/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(collection: str, record_id: int, db: Session = Depends(get_db)) -> None:
    validate_collection(collection)
    if not api_record_repository.delete(db, collection, record_id):
        raise HTTPException(status_code=404, detail="Registro no encontrado.")
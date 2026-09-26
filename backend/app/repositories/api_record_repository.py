from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.api_record import ApiRecord


class ApiRecordRepository:
    def list(self, db: Session, collection: str) -> list[dict[str, Any]]:
        records = db.scalars(
            select(ApiRecord)
            .where(ApiRecord.collection == collection)
            .order_by(ApiRecord.id)
        )
        return [{**record.payload, "id": record.id} for record in records]

    def count(self, db: Session, collection: str) -> int:
        return db.scalar(
            select(func.count(ApiRecord.id)).where(ApiRecord.collection == collection)
        ) or 0

    def create(
        self, db: Session, collection: str, payload: dict[str, Any]
    ) -> dict[str, Any]:
        record = ApiRecord(collection=collection, payload=payload)
        db.add(record)
        db.commit()
        db.refresh(record)
        return {**record.payload, "id": record.id}

    def update(
        self, db: Session, collection: str, record_id: int, payload: dict[str, Any]
    ) -> dict[str, Any] | None:
        record = db.scalar(
            select(ApiRecord).where(
                ApiRecord.collection == collection, ApiRecord.id == record_id
            )
        )
        if record is None:
            return None
        record.payload = payload
        db.commit()
        db.refresh(record)
        return {**record.payload, "id": record.id}

    def delete(self, db: Session, collection: str, record_id: int) -> bool:
        record = db.scalar(
            select(ApiRecord).where(
                ApiRecord.collection == collection, ApiRecord.id == record_id
            )
        )
        if record is None:
            return False
        db.delete(record)
        db.commit()
        return True


api_record_repository = ApiRecordRepository()
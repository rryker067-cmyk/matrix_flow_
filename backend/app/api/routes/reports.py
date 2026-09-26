from collections import defaultdict
from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.api_record import ApiRecord
from app.repositories.api_record_repository import api_record_repository

router = APIRouter(dependencies=[Depends(get_current_user)])


def _number(value: object) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


@router.get("")
def get_report(db: Session = Depends(get_db)) -> dict:
    sales = db.scalars(
        select(ApiRecord).where(ApiRecord.collection == "sales").order_by(ApiRecord.created_at)
    ).all()
    inventory = api_record_repository.list(db, "inventory")
    sales_by_month: dict[str, float] = defaultdict(float)
    sales_by_branch: dict[str, float] = defaultdict(float)
    months = []
    current = datetime.now(UTC).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    for offset in range(11, -1, -1):
        year = current.year
        month = current.month - offset
        while month <= 0:
            month += 12
            year -= 1
        months.append(f"{year:04d}-{month:02d}")
    for record in sales:
        amount = _number(record.payload.get("amount"))
        timestamp = record.created_at
        if timestamp.tzinfo is None:
            timestamp = timestamp.replace(tzinfo=UTC)
        sales_by_month[timestamp.strftime("%Y-%m")] += amount
        branch = str(record.payload.get("branch", "Sin sucursal"))
        sales_by_branch[branch] += amount
    monthly_series = [{"month": month, "total": sales_by_month.get(month, 0)} for month in months]
    return {
        "sales": {"current": sum(_number(row.payload.get("amount")) for row in sales), "records": len(sales)},
        "inventory": {"quantity": sum(_number(row.get("quantity")) for row in inventory), "records": len(inventory)},
        "operations": {"completed": api_record_repository.count(db, "operations")},
        "companies": api_record_repository.count(db, "companies"),
        "branches": api_record_repository.count(db, "branches"),
        "products": api_record_repository.count(db, "products"),
        "sales_records": len(sales),
        "inventory_records": len(inventory),
        "vectors": api_record_repository.count(db, "vectors"),
        "matrices": api_record_repository.count(db, "matrices"),
        "sales_by_month": monthly_series,
        "sales_by_branch": [
            {"branch": branch, "total": total}
            for branch, total in sorted(sales_by_branch.items(), key=lambda item: item[1], reverse=True)
        ],
    }

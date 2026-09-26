from fastapi import APIRouter, status

from app.schemas.company import Company, CompanyCreate
from app.services.company_service import create_company, list_companies

router = APIRouter()


@router.get("", response_model=list[Company])
def get_companies() -> list[Company]:
    return list_companies()


@router.post("", response_model=Company, status_code=status.HTTP_201_CREATED)
def post_company(payload: CompanyCreate) -> Company:
    return create_company(payload)

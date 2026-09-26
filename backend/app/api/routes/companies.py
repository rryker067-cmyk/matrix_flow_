from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.company import Company, CompanyCreate
from app.services.company_service import create_company, list_companies

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[Company])
def get_companies(db: Session = Depends(get_db)) -> list[Company]:
    return list_companies(db)


@router.post("", response_model=Company, status_code=status.HTTP_201_CREATED)
def post_company(payload: CompanyCreate, db: Session = Depends(get_db)) -> Company:
    return create_company(db, payload)

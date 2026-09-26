from app.repositories.company_repository import company_repository
from app.schemas.company import Company, CompanyCreate


def list_companies() -> list[Company]:
    return [Company.model_validate(company) for company in company_repository.list()]


def create_company(payload: CompanyCreate) -> Company:
    company = company_repository.create(payload.model_dump())
    return Company.model_validate(company)
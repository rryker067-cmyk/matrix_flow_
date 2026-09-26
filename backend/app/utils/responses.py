from fastapi import HTTPException

from app.core.exceptions import DomainError


def domain_error(error: DomainError) -> HTTPException:
    return HTTPException(status_code=422, detail=str(error))

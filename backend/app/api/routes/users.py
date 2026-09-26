from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.security import User
from app.schemas.user import UserSummary

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[UserSummary])
def list_users(db: Session = Depends(get_db)) -> list[UserSummary]:
	users = db.scalars(
		select(User).options(joinedload(User.role)).order_by(User.id)
	).all()
	return [
		UserSummary(
			id=user.id,
			name=user.full_name,
			email=user.email,
			role=user.role.name,
			status="active" if user.is_active else "inactive",
		)
		for user in users
	]
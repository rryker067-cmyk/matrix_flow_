import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import get_current_user
from app.main import app
from app.models.api_record import ApiRecord
from app.models.security import Role, User

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)
Base.metadata.create_all(bind=test_engine)


def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = lambda: None


@pytest.fixture(autouse=True)
def clean_test_data():
    with TestSessionLocal() as db:
        db.query(ApiRecord).delete()
        db.query(User).delete()
        db.query(Role).delete()
        db.commit()
    yield
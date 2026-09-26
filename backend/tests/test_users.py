from fastapi.testclient import TestClient

from app.main import app
from app.models.security import Role, User
from tests.conftest import TestSessionLocal

client = TestClient(app)


def test_user_listing_never_returns_password_hash():
    with TestSessionLocal() as db:
        role = Role(name="viewer")
        db.add(role)
        db.flush()
        db.add(User(
            role_id=role.id,
            full_name="Read Only User",
            email="viewer@example.test",
            password_hash="secret-hash-value",
        ))
        db.commit()

    response = client.get("/api/v1/users")
    assert response.status_code == 200
    assert response.json()[0]["email"] == "viewer@example.test"
    assert "password_hash" not in response.json()[0]
from fastapi.testclient import TestClient

from app.core.config import settings
from app.core.security import get_current_user, hash_password
from app.main import app
from app.models.security import Role, User
from tests.conftest import TestSessionLocal

client = TestClient(app)


def test_login_checks_persisted_user_and_password():
    old_secret = settings.jwt_secret_key
    settings.jwt_secret_key = "local-test-signing-key-at-least-32-chars"
    try:
        with TestSessionLocal() as db:
            role = Role(name="admin")
            db.add(role)
            db.flush()
            db.add(User(
                role_id=role.id,
                full_name="Admin Test",
                email="admin@example.test",
                password_hash=hash_password("correct-password-123"),
            ))
            db.commit()

        response = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.test", "password": "correct-password-123"},
        )
        assert response.status_code == 200
        assert response.json()["user"]["name"] == "Admin Test"
        assert response.json()["access_token"]

        app.dependency_overrides.pop(get_current_user, None)
        protected = client.get(
            "/api/v1/resources/products",
            headers={"Authorization": f"Bearer {response.json()['access_token']}"},
        )
        assert protected.status_code == 200
    finally:
        app.dependency_overrides[get_current_user] = lambda: None
        settings.jwt_secret_key = old_secret
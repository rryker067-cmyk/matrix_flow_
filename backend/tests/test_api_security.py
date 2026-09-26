from fastapi.testclient import TestClient

from app.core.security import get_current_user
from app.main import app

client = TestClient(app)


def test_data_routes_require_authentication():
    app.dependency_overrides.pop(get_current_user, None)
    try:
        response = client.get("/api/v1/resources/products")
        assert response.status_code == 401
    finally:
        app.dependency_overrides[get_current_user] = lambda: None
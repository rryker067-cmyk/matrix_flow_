from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.core.security import get_current_user
from app.main import app
from app.core.security import hash_password
from app.models.security import Role, User
from tests.conftest import TestSessionLocal, test_admin_user

client = TestClient(app)


def test_data_routes_require_authentication():
    app.dependency_overrides.pop(get_current_user, None)
    try:
        response = client.get("/api/v1/resources/products")
        assert response.status_code == 401
    finally:
        app.dependency_overrides[get_current_user] = lambda: test_admin_user


def test_viewer_can_read_reports_but_not_business_records():
    with TestSessionLocal() as db:
        role = Role(name="viewer")
        db.add(role)
        db.flush()
        viewer = User(
            role_id=role.id,
            full_name="Report Viewer",
            email="report-viewer@example.test",
            password_hash=hash_password("viewer-password-123"),
        )
        db.add(viewer)
        db.commit()
        viewer = db.scalar(select(User).options(joinedload(User.role)).where(User.id == viewer.id))

    app.dependency_overrides[get_current_user] = lambda: viewer
    try:
        assert client.get("/api/v1/reports").status_code == 200
        assert client.get("/api/v1/resources/products").status_code == 403
        assert client.post(
            "/api/v1/operations",
            json={"operation": "dot_product", "data": [1, 2], "other": [3, 4]},
        ).status_code == 403
    finally:
        app.dependency_overrides[get_current_user] = lambda: test_admin_user


def test_member_can_execute_operations_but_cannot_manage_users():
    with TestSessionLocal() as db:
        role = Role(name="member")
        db.add(role)
        db.flush()
        member = User(
            role_id=role.id,
            full_name="Analyst Member",
            email="analyst-member@example.test",
            password_hash=hash_password("member-password-123"),
        )
        db.add(member)
        db.commit()
        member = db.scalar(select(User).options(joinedload(User.role)).where(User.id == member.id))

    app.dependency_overrides[get_current_user] = lambda: member
    try:
        operation = client.post(
            "/api/v1/operations",
            json={"operation": "dot_product", "data": [1, 2], "other": [3, 4]},
        )
        assert operation.status_code == 200
        assert client.get("/api/v1/users").status_code == 403
    finally:
        app.dependency_overrides[get_current_user] = lambda: test_admin_user
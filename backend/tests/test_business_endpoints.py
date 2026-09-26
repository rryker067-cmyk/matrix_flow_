from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_products_endpoint():
    response = client.post(
        "/api/v1/products",
        json={"name": "Laptop Pro 14", "category": "Computacion", "price": 1249, "stock": 42},
    )

    assert response.status_code == 201
    assert response.json()["status"] == "active"
    assert client.get("/api/v1/products").status_code == 200


def test_sales_endpoint():
    response = client.post(
        "/api/v1/sales",
        json={"code": "MF-9284", "branch": "Lima Centro", "customer": "TecnoRed", "amount": 4280},
    )

    assert response.status_code == 201
    assert response.json()["status"] == "completed"
    assert client.get("/api/v1/sales").status_code == 200


def test_inventory_endpoint():
    response = client.post(
        "/api/v1/inventory",
        json={"product": "Laptop Pro 14", "branch": "Lima Centro", "quantity": 42, "movement": "entry"},
    )

    assert response.status_code == 201
    assert response.json()["status"] == "available"
    assert client.get("/api/v1/inventory").status_code == 200


def test_business_endpoints_validate_values():
    response = client.post(
        "/api/v1/products",
        json={"name": "Monitor", "category": "Pantallas", "price": -1, "stock": 2},
    )

    assert response.status_code == 422
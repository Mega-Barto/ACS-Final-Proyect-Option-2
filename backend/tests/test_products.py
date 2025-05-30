import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.models import Product

def test_create_product(client: TestClient, auth_headers):
    """Prueba crear un nuevo producto"""
    response = client.post(
        "/api/products/",
        json={
            "name": "New Product",
            "description": "This is a new product for testing",
            "price": 29.99
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Product"
    assert data["description"] == "This is a new product for testing"
    assert data["price"] == 29.99
    assert "id" in data
    assert "user_id" in data

def test_create_product_unauthorized(client: TestClient):
    """Prueba crear un producto sin autenticación"""
    response = client.post(
        "/api/products/",
        json={
            "name": "Unauthorized Product",
            "description": "This should not be created",
            "price": 10.50
        }
    )
    assert response.status_code == 401

def test_read_products(client: TestClient, auth_headers, test_product):
    """Prueba obtener lista de productos"""
    response = client.get("/api/products/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == "Test Product"

def test_read_user_products(client: TestClient, auth_headers, test_product):
    """Prueba obtener lista de productos del usuario actual"""
    response = client.get("/api/products/user", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "Test Product"

def test_read_product_by_id(client: TestClient, auth_headers, test_product):
    """Prueba obtener un producto específico por ID"""
    response = client.get(f"/api/products/{test_product.id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_product.id
    assert data["name"] == "Test Product"

def test_read_nonexistent_product(client: TestClient, auth_headers):
    """Prueba obtener un producto que no existe"""
    response = client.get("/api/products/nonexistent-id", headers=auth_headers)
    assert response.status_code == 404

def test_update_product(client: TestClient, auth_headers, test_product):
    """Prueba actualizar un producto"""
    response = client.put(
        f"/api/products/{test_product.id}",
        json={
            "name": "Updated Product Name",
            "description": "Updated product description",
            "price": 149.99
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_product.id
    assert data["name"] == "Updated Product Name"
    assert data["description"] == "Updated product description"
    assert data["price"] == 149.99

def test_update_product_partial(client: TestClient, auth_headers, test_product):
    """Prueba actualizar parcialmente un producto"""
    response = client.put(
        f"/api/products/{test_product.id}",
        json={"name": "Only Name Updated"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Only Name Updated"
    assert data["description"] == "This is a test product"  # Unchanged
    assert data["price"] == 99.99  # Unchanged

def test_update_another_users_product(client: TestClient, db, auth_headers):
    """Prueba actualizar un producto que pertenece a otro usuario"""
    # Crear producto para otro usuario
    other_product = Product(
        id="other-product-id",
        name="Other User Product",
        description="This product belongs to another user",
        price=50.00,
        user_id="another-user-id"
    )
    db.add(other_product)
    db.commit()
    
    response = client.put(
        f"/api/products/{other_product.id}",
        json={"name": "Attempted Update"},
        headers=auth_headers
    )
    assert response.status_code == 403  # Forbidden

def test_delete_product(client: TestClient, db, auth_headers, test_product):
    """Prueba eliminar un producto"""
    response = client.delete(f"/api/products/{test_product.id}", headers=auth_headers)
    assert response.status_code == 204
    
    # Verificar que el producto ha sido eliminado
    product = db.query(Product).filter(Product.id == test_product.id).first()
    assert product is None

def test_delete_another_users_product(client: TestClient, db, auth_headers):
    """Prueba eliminar un producto que pertenece a otro usuario"""
    # Crear producto para otro usuario
    other_product = Product(
        id="other-product-id",
        name="Other User Product",
        description="This product belongs to another user",
        price=50.00,
        user_id="another-user-id"
    )
    db.add(other_product)
    db.commit()
    
    response = client.delete(f"/api/products/{other_product.id}", headers=auth_headers)
    assert response.status_code == 403  # Forbidden

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_register_user(client: TestClient):
    """Prueba el registro de un nuevo usuario"""
    response = client.post(
        "/api/auth/register",
        json={
            "name": "New User",
            "email": "newuser@example.com",
            "password": "Password123!"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["name"] == "New User"
    assert data["email"] == "newuser@example.com"
    assert "password" not in data  # Password no debe estar en la respuesta

def test_register_existing_email(client: TestClient, test_user):
    """Prueba que no se puede registrar un usuario con un email ya existente"""
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Another User",
            "email": "test@example.com",  # Email ya usado por test_user
            "password": "Password123!"
        }
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_register_invalid_password(client: TestClient):
    """Prueba validación de contraseña al registrar"""
    # Contraseña demasiado corta
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Invalid User",
            "email": "invalid@example.com",
            "password": "Short1"
        }
    )
    assert response.status_code == 422
    
    # Contraseña sin número
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Invalid User",
            "email": "invalid@example.com",
            "password": "PasswordOnly!"
        }
    )
    assert response.status_code == 422

def test_login_success(client: TestClient, test_user):
    """Prueba login exitoso"""
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "Test1234!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_incorrect_password(client: TestClient, test_user):
    """Prueba login con contraseña incorrecta"""
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "WrongPassword123!"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_login_nonexistent_user(client: TestClient):
    """Prueba login con email inexistente"""
    response = client.post(
        "/api/auth/login",
        data={"username": "nonexistent@example.com", "password": "Test1234!"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

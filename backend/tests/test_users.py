import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.models import User

def test_read_current_user(client: TestClient, auth_headers):
    """Prueba obtener el perfil del usuario actual"""
    response = client.get("/api/users/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"

def test_read_current_user_unauthorized(client: TestClient):
    """Prueba acceder al perfil sin autenticación"""
    response = client.get("/api/users/me")
    assert response.status_code == 401

def test_update_user_profile(client: TestClient, auth_headers, test_user):
    """Prueba actualizar el perfil del usuario"""
    response = client.put(
        "/api/users/me",
        json={"name": "Updated User Name"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated User Name"
    assert data["email"] == "test@example.com"

def test_update_user_email(client: TestClient, auth_headers):
    """Prueba actualizar el email del usuario"""
    response = client.put(
        "/api/users/me",
        json={"email": "updated@example.com"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "updated@example.com"

def test_update_user_password(client: TestClient, auth_headers):
    """Prueba actualizar la contraseña del usuario"""
    response = client.put(
        "/api/users/me",
        json={"password": "NewPassword123!"},
        headers=auth_headers
    )
    assert response.status_code == 200
    
    # Verificar que se puede hacer login con la nueva contraseña
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "NewPassword123!"}
    )
    assert response.status_code == 200

def test_delete_user(client: TestClient, auth_headers, db, test_user):
    """Prueba eliminar la cuenta de usuario"""
    response = client.delete("/api/users/me", headers=auth_headers)
    assert response.status_code == 204
    
    # Verificar que el usuario ha sido desactivado
    user = db.query(User).filter(User.id == test_user.id).first()
    assert not user.is_active

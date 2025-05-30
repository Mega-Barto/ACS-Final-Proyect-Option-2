import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_health_check(client: TestClient, auth_headers):
    """Prueba el endpoint de health check"""
    response = client.get("/api/health", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"
    
    # Verificar que contiene información del sistema
    assert "system_info" in data
    system_info = data["system_info"]
    assert "python_version" in system_info
    assert "platform" in system_info
    
    # Verificar que contiene información de la base de datos
    assert "database" in data
    assert data["database"]["connected"] == True

def test_health_check_unauthenticated(client: TestClient):
    """Prueba que el health check requiere autenticación"""
    response = client.get("/api/health")
    assert response.status_code == 401

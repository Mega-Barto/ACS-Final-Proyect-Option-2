import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from typing import Generator
import sys
import os

# Agregar el directorio raíz del proyecto al path de Python para poder importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.database import Base, get_db
from main import app
from routers.auth import create_access_token, get_password_hash
from models.models import User, Product
from uuid import uuid4

# Configuración de la base de datos de prueba (SQLite en memoria)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    """
    Fixture que crea una base de datos limpia para cada test
    """
    # Crear las tablas en la base de datos de prueba
    Base.metadata.create_all(bind=engine)
    
    # Crear una sesión de base de datos para las pruebas
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        
    # Limpiar las tablas después de cada prueba
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db) -> Generator:
    """
    Fixture que crea un cliente de prueba para la aplicación FastAPI
    """
    def _get_test_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as client:
        yield client
    

@pytest.fixture(scope="function")
def test_user(db) -> User:
    """
    Fixture que crea un usuario de prueba en la base de datos
    """
    user = User(
        id=str(uuid4()),
        name="Test User",
        email="test@example.com",
        password=get_password_hash("Test1234!"),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_user_token(test_user) -> str:
    """
    Fixture que crea un token de acceso para el usuario de prueba
    """
    return create_access_token(data={"sub": test_user.id, "name": test_user.name, "email": test_user.email})


@pytest.fixture(scope="function")
def auth_headers(test_user_token) -> dict:
    """
    Fixture que crea encabezados de autenticación para las pruebas
    """
    return {"Authorization": f"Bearer {test_user_token}"}


@pytest.fixture(scope="function")
def test_product(db, test_user) -> Product:
    """
    Fixture que crea un producto de prueba en la base de datos
    """
    product = Product(
        id=str(uuid4()),
        name="Test Product",
        description="This is a test product",
        price=99.99,
        user_id=test_user.id
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

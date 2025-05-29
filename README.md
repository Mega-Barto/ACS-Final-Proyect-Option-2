# Product Management System

Este proyecto implementa un sistema completo de gestión de productos con un frontend moderno en React, un backend robusto en FastAPI y una base de datos PostgreSQL. El sistema permite la gestión completa de productos y usuarios con autenticación.

## Estructura del Proyecto

```
├── frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   ├── public/
│   └── ...
├── backend (FastAPI)
│   ├── routers/
│   ├── models/
│   ├── schemas/
│   ├── db/
│   └── ...
└── database (PostgreSQL)
```

## Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca para crear interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción rápida para desarrollo web
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para realizar peticiones al backend
- **Tailwind CSS** - Framework CSS para diseño moderno y responsivo
- **React Hook Form** - Manejo de formularios

### Backend
- **FastAPI** - Framework web para construir APIs con Python
- **SQLAlchemy** - ORM para interactuar con la base de datos
- **Pydantic** - Validación de datos y configuración
- **JWT** - Autenticación mediante tokens
- **Uvicorn** - Servidor ASGI de alto rendimiento

### Base de Datos
- **PostgreSQL** - Sistema de gestión de bases de datos relacional
- **SQLAlchemy** - ORM para mapeo objeto-relacional

## Características

- **Autenticación de usuarios** - Registro, inicio de sesión y gestión de permisos
- **Gestión de productos** - CRUD completo para productos
- **Diseño responsivo** - Interfaz adaptable a diferentes dispositivos
- **API RESTful** - Endpoints bien documentados y seguros

## Requisitos

- Docker y Docker Compose
- Node.js y npm (solo para desarrollo local)
- Python 3.8+ (solo para desarrollo local)

## Instalación y Ejecución

### Usando Docker

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd project
   ```

2. Inicia los servicios con Docker Compose:
   ```powershell
   docker compose up
   ```

3. Accede a la aplicación:
   - Frontend: http://localhost:5173
   - API Backend: http://localhost:8000
   - Documentación API: http://localhost:8000/docs

## Estructura de la Base de Datos

### Tablas Principales

- **users**: Almacena información de usuarios y credenciales de autenticación
- **products**: Contiene los productos con sus detalles y referencias

## API Endpoints

### Autenticación
- `POST /api/auth/login`: Autenticación de usuarios
- `POST /api/auth/register`: Registro de nuevos usuarios

### Usuarios
- `GET /api/users/me`: Obtener datos del usuario actual
- `PUT /api/users/me`: Actualizar datos del usuario actual

### Productos
- `GET /api/products`: Listar todos los productos
- `GET /api/products/{id}`: Obtener detalles de un producto
- `POST /api/products`: Crear un nuevo producto
- `PUT /api/products/{id}`: Actualizar un producto existente
- `DELETE /api/products/{id}`: Eliminar un producto

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

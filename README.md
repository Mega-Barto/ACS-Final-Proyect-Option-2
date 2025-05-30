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

## Seguridad del Sitio

El sistema implementa múltiples capas de seguridad para proteger tanto la información de los usuarios como la integridad de los datos:

### Autenticación y Autorización
- **JWT (JSON Web Tokens)** - Sistema de autenticación basado en tokens que permite verificar la identidad del usuario sin necesidad de consultar la base de datos en cada petición.
- **Contraseñas Hasheadas** - Todas las contraseñas son hasheadas utilizando bcrypt, lo que garantiza que incluso si la base de datos es comprometida, las contraseñas están protegidas.
- **Control de Acceso por Roles** - Diferentes niveles de acceso según el rol del usuario (administrador, usuario regular).
- **Expiración de Sesión** - Los tokens de autenticación tienen un tiempo de vida limitado (60 minutos) para minimizar riesgos.

### Seguridad en la API
- **Validación de Datos** - Pydantic verifica que todos los datos cumplen con los esquemas definidos antes de procesarlos.
- **Protección CORS** - Configuración de CORS para permitir solo peticiones desde orígenes autorizados.
- **Endpoints Protegidos** - Rutas que requieren autenticación mediante decoradores de dependencia en FastAPI.

### Seguridad en el Frontend
- **Almacenamiento Seguro de Tokens** - Los tokens se almacenan de forma segura y se envían en los headers de autorización.
- **Interceptores de Axios** - Manejo automático de tokens expirados y errores de autenticación.
- **Validación de Formularios** - Validación tanto en cliente como en servidor para prevenir inyecciones y otros ataques.

## Persistencia de Datos

El sistema utiliza PostgreSQL como base de datos principal, con un enfoque en la durabilidad y consistencia de los datos:

### Estructura de Almacenamiento
- **Volúmenes de Docker** - Los datos de PostgreSQL se almacenan en volúmenes Docker persistentes (`postgres_data`) que sobreviven a reinicios de contenedores.
- **Relaciones y Constraints** - Definición clara de relaciones entre entidades con restricciones de integridad referencial.

### Respaldos y Recuperación
- **Configuración de Respaldos** - PostgreSQL permite configurar respaldos automáticos programados.
- **Punto de Restauración** - Capacidad de restaurar la base de datos a un punto específico en el tiempo gracias al sistema de WAL (Write-Ahead Logging) de PostgreSQL.

### Optimización
- **Índices** - Uso estratégico de índices para mejorar el rendimiento de consultas frecuentes.
- **Conexiones Pooling** - Gestión eficiente de conexiones a la base de datos mediante SQLAlchemy.

## Buenas Prácticas Implementadas

### Arquitectura y Diseño
- **Patrón MVC** - Separación clara de Modelo (SQLAlchemy), Vista (React) y Controlador (FastAPI).
- **API RESTful** - Diseño de API siguiendo principios REST con nombres de recursos apropiados y verbos HTTP semánticos.
- **Principio de Responsabilidad Única** - Cada componente y módulo tiene una única responsabilidad.

### Seguridad
- **Principio de Menor Privilegio** - Los usuarios solo tienen acceso a los recursos que necesitan.
- **Auditoría de Dependencias** - Control de versiones de dependencias para evitar vulnerabilidades conocidas.

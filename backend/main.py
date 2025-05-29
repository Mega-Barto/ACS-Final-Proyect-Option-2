from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from db.database import engine, Base, get_db
from sqlalchemy import text
from sqlalchemy.orm import Session
from routers import auth, users, products
import models.models as models
import uvicorn
import time
import platform
import psutil
import os
from datetime import datetime

# Create and configure the FastAPI app
app = FastAPI(
    title="Product Management API",
    description="API for managing products and users",
    version="0.1.0"
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])

@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint to verify the status of the API and its components.
    Returns detailed information about the application status, database connection,
    system resources, and performance metrics.
    """
    start_time = time.time()
    
    # Collect application information
    app_info = {
        "name": app.title,
        "version": app.version,
        "description": app.description,
        "uptime": datetime.now().isoformat(),  # In production, track actual uptime
    }
    
    # Check database connection
    db_status = "healthy"
    db_error = None
    try:
        # Simple query to verify database connection
        db.execute(text("SELECT 1")).first()
    except Exception as e:
        db_status = "unhealthy"
        db_error = str(e)
    
    # Check system resources
    system_info = {
        "os": platform.system(),
        "os_version": platform.version(),
        "python_version": platform.python_version(),
        "hostname": platform.node(),
        "cpu_count": os.cpu_count(),
        "cpu_usage": psutil.cpu_percent(interval=0.1),
        "memory_total": round(psutil.virtual_memory().total / (1024 * 1024), 2),  # MB
        "memory_available": round(psutil.virtual_memory().available / (1024 * 1024), 2),  # MB
        "memory_used_percent": psutil.virtual_memory().percent,
        "disk_usage": psutil.disk_usage('/').percent,
    }
    
    # Calculate response time
    response_time = time.time() - start_time
    
    # Determine overall status
    overall_status = "healthy" if db_status == "healthy" else "degraded"
    
    return {
        "status": overall_status,
        "timestamp": datetime.now().isoformat(),
        "application": app_info,
        "database": {
            "status": db_status,
            "error": db_error
        },
        "system": system_info,
        "performance": {
            "response_time_ms": round(response_time * 1000, 2)
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
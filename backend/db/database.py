from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database connection string
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@db:5432/product_db"

# Create SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
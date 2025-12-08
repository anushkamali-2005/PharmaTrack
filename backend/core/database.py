"""
Database configuration and session management.
This file sets up the database connection that will be used throughout the app.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL - will be set via environment variable
# For now using SQLite for local development (easy to switch to PostgreSQL later)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pharmacy.db")

# Create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

# Dependency to get database session in API endpoints
def get_db():
    """
    Dependency function to get database session.
    Usage in FastAPI:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            # use db here
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

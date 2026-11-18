import logging
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("careerpath.database")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def normalize_database_url(url: str) -> str:
    """
    Normalizes database connection strings for SQLAlchemy 2.0 compatibility:
    - Render PostgreSQL URLs starting with 'postgres://' are mapped to 'postgresql+psycopg2://'
    - Bare 'postgresql://' is mapped to 'postgresql+psycopg2://'
    - Bare 'mysql://' is mapped to 'mysql+pymysql://'
    """
    if not url:
        return settings.SQLITE_FALLBACK_URL
        
    trimmed = url.strip()
    if trimmed.startswith("postgres://"):
        return trimmed.replace("postgres://", "postgresql+psycopg2://", 1)
    if trimmed.startswith("postgresql://") and not trimmed.startswith("postgresql+"):
        return trimmed.replace("postgresql://", "postgresql+psycopg2://", 1)
    if trimmed.startswith("mysql://") and not trimmed.startswith("mysql+"):
        return trimmed.replace("mysql://", "mysql+pymysql://", 1)
    return trimmed

def get_engine():
    """
    Constructs the SQLAlchemy engine based on configuration:
    - Automatically handles PostgreSQL (Render production), MySQL, or embedded SQLite (local dev).
    - Falls back cleanly to SQLite if an external database is unreachable.
    """
    raw_url = settings.DATABASE_URL
    target_url = normalize_database_url(raw_url)
    
    # 1. SQLite Engine (Default for local development)
    if target_url.startswith("sqlite"):
        logger.info(f"Connecting to SQLite database: {target_url}")
        return create_engine(
            target_url,
            connect_args={"check_same_thread": False}
        )
    
    # 2. Remote PostgreSQL or MySQL Engine (for Render / Cloud)
    try:
        logger.info(f"Connecting to database: {target_url.split('@')[-1] if '@' in target_url else target_url}")
        engine = create_engine(
            target_url,
            pool_pre_ping=True,
            pool_recycle=300,
            pool_size=10,
            max_overflow=20,
            connect_args={"connect_timeout": 5}
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Successfully established connection to cloud database.")
        return engine
    except Exception as e:
        logger.warning(
            f"External database connection failed ({e}). "
            f"Falling back safely to local SQLite database: {settings.SQLITE_FALLBACK_URL}"
        )
        return create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI Dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes all database tables and verifies schema."""
    from app.models import db_models  # Ensure all models and indexes are registered
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema and indexes verified successfully.")

# Automatically initialize tables on startup
try:
    init_db()
except Exception as _e:
    logger.warning(f"Initial DB create_all deferred: {_e}")

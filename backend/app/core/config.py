import os
from typing import List

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "CareerPath AI")
    APP_ENV: str = os.getenv("APP_ENV", "development")
    CAREERPATH_DEMO_MODE: bool = os.getenv("CAREERPATH_DEMO_MODE", "false").lower() in ("true", "1")
    
    # Database Configuration
    # Defaults to local SQLite for zero-config local development without MySQL.
    # In production (e.g. Render / Railway), set DATABASE_URL to your PostgreSQL or MySQL connection string.
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./careerpath_ai.db")
    SQLITE_FALLBACK_URL: str = "sqlite:///./careerpath_ai.db"
    
    # JWT Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-careerpath-ai-jwt-key-2026-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODEL_DIR: str = os.path.join(BASE_DIR, "ml_artifacts")
    DATA_DIR: str = os.path.join(BASE_DIR, "data", "processed")
    METADATA_DIR: str = os.path.join(BASE_DIR, "data", "metadata")
    DEMO_DIR: str = os.path.join(BASE_DIR, "data", "demo")
    
    # Cache settings
    CACHE_DEFAULT_TTL: int = int(os.getenv("CACHE_DEFAULT_TTL", "300"))  # 5 minutes
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://careerpath-ai-onet.netlify.app",
        "https://gorgeous-alpaca-2e444e.netlify.app",
        "https://careerpathai.netlify.app",
        "*"
    ]

settings = Settings()

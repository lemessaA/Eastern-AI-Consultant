"""Centralised configuration powered by pydantic-settings.

All runtime configuration is loaded from environment variables (or a local
`.env` file in development). Importing :data:`settings` gives every other module
a single, validated source of truth.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Runtime ---
    ENVIRONMENT: Literal["development", "staging", "production", "test"] = "development"
    DEBUG: bool = True
    APP_NAME: str = "Eastern AI Consultant API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    # --- Database ---
    DATABASE_URL: str = (
        "postgresql+asyncpg://eastern_ai:eastern_ai@localhost:5432/eastern_ai"
    )
    SYNC_DATABASE_URL: str = (
        "postgresql+psycopg2://eastern_ai:eastern_ai@localhost:5432/eastern_ai"
    )
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # --- Redis ---
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- Security ---
    SECRET_KEY: str = "dev-secret-change-me"
    JWT_SECRET: str = "dev-jwt-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # --- CORS ---
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # --- LLM ---
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_FAST_MODEL: str = "llama-3.1-8b-instant"
    OPENAI_API_KEY: str = ""
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # --- OAuth ---
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

    # --- Storage ---
    STORAGE_BACKEND: Literal["local", "s3", "cloudinary"] = "local"
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_S3_BUCKET: str = ""
    CLOUDINARY_URL: str = ""

    # --- Vector store ---
    VECTOR_STORE_PATH: str = "chroma_db"
    VECTOR_COLLECTION: str = "eai_knowledge"

    # --- Rate limit ---
    RATE_LIMIT_PER_MINUTE: int = 60

    @field_validator("CORS_ORIGINS")
    @classmethod
    def _normalize_cors_origins(cls, v: str) -> str:
        """Comma-separated origins, trimmed; trailing slashes removed (browser sends none)."""
        parts = [p.strip().rstrip("/") for p in v.strip().split(",") if p.strip()]
        return ",".join(parts)

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor — call from any module."""
    return Settings()


settings = get_settings()

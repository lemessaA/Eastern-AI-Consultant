"""Centralised configuration powered by pydantic-settings.

All runtime configuration is loaded from environment variables (or a local
`.env` file in development). Importing :data:`settings` gives every other module
a single, validated source of truth.

Security Notes:
- SECRET_KEY and JWT_SECRET MUST be set via environment variables in production.
  Generate with: openssl rand -base64 48
- For production JWT signing, use RS256 with JWT_PRIVATE_KEY/JWT_PUBLIC_KEY
  Generate keys: openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -pubout -out public.pem
- Never commit .env files. Use Vercel/Cloud provider secret management.
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
    DEBUG: bool = False  # SECURITY: Default to False, override in .env.development
    APP_NAME: str = "Eastern AI Consultant API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    # --- Database ---
    # Use postgresql+asyncpg://user:pass@host:port/db for async (app)
    # Use postgresql+psycopg2://user:pass@host:port/db for sync (alembic)
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://eastern_ai:eastern_ai@localhost:5432/eastern_ai",
        description="Async database URL for SQLAlchemy (app runtime)",
    )
    SYNC_DATABASE_URL: str = Field(
        default="postgresql+psycopg2://eastern_ai:eastern_ai@localhost:5432/eastern_ai",
        description="Sync database URL for alembic migrations",
    )
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # --- Redis ---
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- Security ---
    # CRITICAL: No defaults! Must be set via environment in production.
    # Generate with: openssl rand -base64 48
    SECRET_KEY: str = Field(
        ...,
        min_length=32,
        description="Master secret for session signing, CSRF, etc. Generate: openssl rand -base64 48",
    )
    JWT_SECRET: str = Field(
        ...,
        min_length=32,
        description="JWT signing secret (HS256). Generate: openssl rand -base64 48",
    )
    # For production, use RS256 with asymmetric keys:
    JWT_ALGORITHM: Literal["HS256", "RS256"] = "HS256"
    JWT_PRIVATE_KEY: str = Field(
        default="",
        description="Base64-encoded RSA private key for RS256 signing (production)",
    )
    JWT_PUBLIC_KEY: str = Field(
        default="",
        description="Base64-encoded RSA public key for RS256 verification (production)",
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # --- CORS ---
    # PRODUCTION: Set to your actual domains, e.g. https://app.example.com,https://api.example.com
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

    @field_validator("SECRET_KEY", "JWT_SECRET")
    @classmethod
    def _validate_secrets(cls, v: str, info) -> str:
        """Ensure secrets are not using default placeholder values in production."""
        # Get environment from the data being validated
        env = info.data.get("ENVIRONMENT", "development") if hasattr(info, "data") else "development"
        if env == "production":
            forbidden = {
                "dev-secret-change-me",
                "dev-jwt-change-me",
                "change_me_in_production",
                "replace_with_64_char_random_string",
            }
            if v in forbidden:
                raise ValueError(
                    f"{info.field_name} must be set to a strong random value in production. "
                    f"Generate with: openssl rand -base64 48"
                )
        if len(v) < 32:
            raise ValueError(f"{info.field_name} must be at least 32 characters")
        return v

    @field_validator("JWT_PRIVATE_KEY", "JWT_PUBLIC_KEY", mode="before")
    @classmethod
    def _validate_rsa_keys(cls, v: str, info) -> str:
        """Validate RSA keys when using RS256."""
        # We'll check algorithm in model_post_init since we need access to other fields
        return v

    def model_post_init(self, __context) -> None:
        """Validate RSA keys are provided when using RS256 in production."""
        if self.is_production and self.JWT_ALGORITHM == "RS256":
            if not self.JWT_PRIVATE_KEY or not self.JWT_PUBLIC_KEY:
                raise ValueError(
                    "JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are required when JWT_ALGORITHM=RS256 in production. "
                    "Generate with: openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -pubout -out public.pem "
                    "Then base64 encode both keys."
                )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def jwt_signing_key(self) -> str:
        """Return the appropriate key for JWT signing based on algorithm."""
        if self.JWT_ALGORITHM == "RS256":
            return self.JWT_PRIVATE_KEY
        return self.JWT_SECRET

    @property
    def jwt_verification_key(self) -> str:
        """Return the appropriate key for JWT verification based on algorithm."""
        if self.JWT_ALGORITHM == "RS256":
            return self.JWT_PUBLIC_KEY
        return self.JWT_SECRET


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor — call from any module."""
    return Settings()


settings = get_settings()

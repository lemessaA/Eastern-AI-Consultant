"""Liveness / readiness probes."""

from __future__ import annotations

from fastapi import APIRouter

from app.core.config import settings
from app.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
    )


@router.get("/ping")
async def ping() -> dict[str, str]:
    return {"ping": "pong"}

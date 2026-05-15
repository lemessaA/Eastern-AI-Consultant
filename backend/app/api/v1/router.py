"""Aggregate v1 router."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin,
    agriculture,
    automation,
    business,
    career,
    chat,
    community,
    courses,
    health,
    notifications,
    payments,
    tools,
    users,
)
from app.api.v1.endpoints import auth as auth_endpoints

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth_endpoints.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(business.router, prefix="/business", tags=["business"])
api_router.include_router(automation.router, prefix="/automation", tags=["automation"])
api_router.include_router(agriculture.router, prefix="/agriculture", tags=["agriculture"])
api_router.include_router(career.router, prefix="/career", tags=["career"])
api_router.include_router(community.router, prefix="/community", tags=["community"])
api_router.include_router(tools.router, prefix="/tools", tags=["tools"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

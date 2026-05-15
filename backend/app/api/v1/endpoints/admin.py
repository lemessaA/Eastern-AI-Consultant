"""Admin dashboard endpoints — admin role required."""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select

from app.core.deps import DB, require_admin
from app.models.chat import Conversation, Message
from app.models.enums import Language, UserRole
from app.models.learning import Course, Enrollment
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.user import UserRead

router = APIRouter(dependencies=[Depends(require_admin)])


@router.get("/stats")
async def admin_stats(db: DB) -> dict:
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    new_week = (
        await db.execute(
            select(func.count(User.id)).where(User.created_at >= week_ago)
        )
    ).scalar_one()
    total_convos = (await db.execute(select(func.count(Conversation.id)))).scalar_one()
    total_messages = (await db.execute(select(func.count(Message.id)))).scalar_one()
    enrollments = (await db.execute(select(func.count(Enrollment.id)))).scalar_one()

    # Language distribution
    lang_rows = (
        await db.execute(
            select(User.preferred_language, func.count(User.id)).group_by(User.preferred_language)
        )
    ).all()

    role_rows = (
        await db.execute(select(User.role, func.count(User.id)).group_by(User.role))
    ).all()

    return {
        "users": int(total_users),
        "new_users_7d": int(new_week),
        "conversations": int(total_convos),
        "messages": int(total_messages),
        "enrollments": int(enrollments),
        "languages": {lang.value if isinstance(lang, Language) else str(lang): int(c) for lang, c in lang_rows},
        "roles": {r.value if isinstance(r, UserRole) else str(r): int(c) for r, c in role_rows},
    }


@router.get("/users", response_model=PaginatedResponse[UserRead])
async def list_users(
    db: DB,
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
) -> PaginatedResponse[UserRead]:
    stmt = select(User)
    if search:
        s = f"%{search.lower()}%"
        stmt = stmt.where(func.lower(User.email).like(s) | func.lower(User.full_name).like(s))
    total = (await db.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    rows = (
        await db.execute(
            stmt.order_by(User.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
    ).scalars().all()
    return PaginatedResponse(
        items=[UserRead.model_validate(u) for u in rows],
        total=int(total),
        page=page,
        page_size=page_size,
    )


@router.patch("/users/{user_id}/role", response_model=UserRead)
async def update_role(
    user_id: uuid.UUID, role: UserRole, db: DB
) -> UserRead:
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    await db.commit()
    await db.refresh(user)
    return UserRead.model_validate(user)


@router.post("/users/{user_id}/disable", response_model=MessageResponse)
async def disable_user(user_id: uuid.UUID, db: DB) -> MessageResponse:
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    await db.commit()
    return MessageResponse(message="User disabled.")


@router.get("/courses")
async def admin_courses(db: DB) -> list[dict]:
    rows = (await db.execute(select(Course).order_by(Course.created_at.desc()))).scalars().all()
    return [
        {
            "id": str(c.id),
            "title": c.title,
            "slug": c.slug,
            "status": c.status.value,
            "rating": c.rating,
            "language": c.language.value,
            "is_free": c.is_free,
            "created_at": c.created_at.isoformat(),
        }
        for c in rows
    ]

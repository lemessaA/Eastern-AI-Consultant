"""Notification endpoints."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from sqlalchemy import func, select

from app.core.deps import DB, CurrentUser
from app.models.notification import Notification
from app.schemas.common import MessageResponse

router = APIRouter()


@router.get("")
async def list_notifications(user: CurrentUser, db: DB) -> list[dict]:
    rows = (
        await db.execute(
            select(Notification)
            .where(Notification.user_id == user.id)
            .order_by(Notification.created_at.desc())
            .limit(100)
        )
    ).scalars().all()
    return [
        {
            "id": str(n.id),
            "title": n.title,
            "body": n.body,
            "link": n.link,
            "channel": n.channel.value,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat(),
        }
        for n in rows
    ]


@router.get("/unread-count")
async def unread_count(user: CurrentUser, db: DB) -> dict:
    count = (
        await db.execute(
            select(func.count(Notification.id)).where(
                Notification.user_id == user.id, Notification.is_read.is_(False)
            )
        )
    ).scalar_one()
    return {"unread": int(count)}


@router.post("/{notification_id}/read", response_model=MessageResponse)
async def mark_read(
    notification_id: uuid.UUID, user: CurrentUser, db: DB
) -> MessageResponse:
    n = (
        await db.execute(
            select(Notification).where(
                Notification.id == notification_id, Notification.user_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    n.read_at = datetime.now(timezone.utc)
    await db.commit()
    return MessageResponse(message="Marked as read.")


@router.post("/read-all", response_model=MessageResponse)
async def mark_all_read(user: CurrentUser, db: DB) -> MessageResponse:
    now = datetime.now(timezone.utc)
    rows = (
        await db.execute(
            select(Notification).where(
                Notification.user_id == user.id, Notification.is_read.is_(False)
            )
        )
    ).scalars().all()
    for n in rows:
        n.is_read = True
        n.read_at = now
    await db.commit()
    return MessageResponse(message=f"Marked {len(rows)} notifications as read.")

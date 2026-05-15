"""Community forum endpoints."""

from __future__ import annotations

import re
import uuid

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from app.core.deps import DB, CurrentUser
from app.models.community import Comment, ForumPost, Reaction
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.community import CommentCreate, CommentRead, ForumPostCreate, ForumPostRead

router = APIRouter()


def _slugify(text: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:200]
    return f"{base}-{uuid.uuid4().hex[:6]}"


@router.get("/posts", response_model=PaginatedResponse[ForumPostRead])
async def list_posts(
    db: DB,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
) -> PaginatedResponse[ForumPostRead]:
    stmt = select(ForumPost).options(selectinload(ForumPost.author))
    if category:
        stmt = stmt.where(ForumPost.category == category)
    if search:
        like = f"%{search.lower()}%"
        stmt = stmt.where(func.lower(ForumPost.title).like(like))

    total = (
        await db.execute(select(func.count(ForumPost.id)).select_from(ForumPost))
    ).scalar_one()
    rows = (
        await db.execute(
            stmt.order_by(ForumPost.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
    ).scalars().all()
    out: list[ForumPostRead] = []
    for p in rows:
        comment_count = (
            await db.execute(
                select(func.count(Comment.id)).where(Comment.post_id == p.id)
            )
        ).scalar_one()
        item = ForumPostRead.model_validate(p)
        item.comment_count = int(comment_count)
        out.append(item)
    return PaginatedResponse(items=out, total=int(total), page=page, page_size=page_size)


@router.post("/posts", response_model=ForumPostRead, status_code=201)
async def create_post(payload: ForumPostCreate, user: CurrentUser, db: DB) -> ForumPostRead:
    post = ForumPost(
        author_id=user.id,
        title=payload.title,
        slug=_slugify(payload.title),
        body=payload.body,
        category=payload.category,
        tags=payload.tags,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post, attribute_names=["author"])
    return ForumPostRead.model_validate(post)


@router.get("/posts/{slug}", response_model=ForumPostRead)
async def get_post(slug: str, db: DB) -> ForumPostRead:
    post = (
        await db.execute(
            select(ForumPost)
            .options(selectinload(ForumPost.author))
            .where(ForumPost.slug == slug)
        )
    ).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.views += 1
    await db.commit()
    out = ForumPostRead.model_validate(post)
    out.comment_count = (
        await db.execute(select(func.count(Comment.id)).where(Comment.post_id == post.id))
    ).scalar_one()
    return out


@router.get("/posts/{slug}/comments", response_model=list[CommentRead])
async def list_comments(slug: str, db: DB) -> list[CommentRead]:
    post = (
        await db.execute(select(ForumPost).where(ForumPost.slug == slug))
    ).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    rows = (
        await db.execute(
            select(Comment)
            .options(selectinload(Comment.author))
            .where(Comment.post_id == post.id)
            .order_by(Comment.created_at)
        )
    ).scalars().all()
    return [CommentRead.model_validate(c) for c in rows]


@router.post("/posts/{slug}/comments", response_model=CommentRead, status_code=201)
async def add_comment(
    slug: str, payload: CommentCreate, user: CurrentUser, db: DB
) -> CommentRead:
    post = (
        await db.execute(select(ForumPost).where(ForumPost.slug == slug))
    ).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    comment = Comment(
        post_id=post.id,
        author_id=user.id,
        body=payload.body,
        parent_id=payload.parent_id,
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment, attribute_names=["author"])
    return CommentRead.model_validate(comment)


@router.post("/posts/{slug}/react", response_model=MessageResponse)
async def react(
    slug: str, emoji: str, user: CurrentUser, db: DB
) -> MessageResponse:
    post = (
        await db.execute(select(ForumPost).where(ForumPost.slug == slug))
    ).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    existing = (
        await db.execute(
            select(Reaction).where(
                Reaction.user_id == user.id,
                Reaction.post_id == post.id,
                Reaction.emoji == emoji,
            )
        )
    ).scalar_one_or_none()
    if existing:
        await db.delete(existing)
        await db.commit()
        return MessageResponse(message="Reaction removed.")
    db.add(Reaction(user_id=user.id, post_id=post.id, emoji=emoji))
    await db.commit()
    return MessageResponse(message="Reaction added.")

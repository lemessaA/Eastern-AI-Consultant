"""Community forum schemas."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserPublic


class ForumPostCreate(BaseModel):
    title: str = Field(min_length=4, max_length=240)
    body: str = Field(min_length=10)
    category: str = "general"
    tags: list[str] = []


class CommentCreate(BaseModel):
    body: str = Field(min_length=1)
    parent_id: uuid.UUID | None = None


class CommentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    body: str
    upvotes: int
    parent_id: uuid.UUID | None = None
    author: UserPublic
    created_at: datetime


class ForumPostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    slug: str
    body: str
    category: str
    tags: list[str]
    views: int
    upvotes: int
    is_answered: bool
    author: UserPublic
    created_at: datetime
    comment_count: int = 0

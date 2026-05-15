"""User schemas."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import Language, UserRole


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    avatar_url: str | None = None
    bio: str | None = None
    country: str | None = None
    city: str | None = None
    phone: str | None = None
    preferred_language: Language = Language.EN


class UserRead(UserBase):
    id: uuid.UUID
    role: UserRole
    is_active: bool
    is_verified: bool
    is_superuser: bool
    created_at: datetime
    last_login_at: datetime | None = None


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    full_name: str
    avatar_url: str | None = None
    role: UserRole


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    avatar_url: str | None = None
    bio: str | None = None
    country: str | None = None
    city: str | None = None
    phone: str | None = None
    preferred_language: Language | None = None

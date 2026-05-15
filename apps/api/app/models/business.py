"""Business profile + uploaded documents used by the consulting workflows."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import BigInteger, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPKMixin
from app.models.enums import Language

if TYPE_CHECKING:
    from app.models.ai import AIReport
    from app.models.user import User


class Business(Base, UUIDPKMixin, TimestampMixin):
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    industry: Mapped[str | None] = mapped_column(String(120), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    country: Mapped[str | None] = mapped_column(String(80), nullable=True)
    city: Mapped[str | None] = mapped_column(String(80), nullable=True)
    website: Mapped[str | None] = mapped_column(String(255), nullable=True)
    employees: Mapped[int | None] = mapped_column(Integer, nullable=True)
    annual_revenue_usd: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    primary_language: Mapped[Language] = mapped_column(
        Enum(Language, name="business_language"), default=Language.EN, nullable=False
    )
    goals: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    challenges: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    extra: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    owner: Mapped["User"] = relationship(back_populates="businesses")
    documents: Mapped[list["BusinessDocument"]] = relationship(
        back_populates="business", cascade="all, delete-orphan"
    )
    reports: Mapped[list["AIReport"]] = relationship(
        back_populates="business", cascade="all, delete-orphan"
    )


class BusinessDocument(Base, UUIDPKMixin, TimestampMixin):
    business_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False
    )
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(120), nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    indexed: Mapped[bool] = mapped_column(default=False, nullable=False)
    vector_collection: Mapped[str | None] = mapped_column(String(120), nullable=True)

    business: Mapped[Business] = relationship(back_populates="documents")

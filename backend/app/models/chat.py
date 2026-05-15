"""Conversations + messages for the AI chat assistant."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPKMixin
from app.models.enums import AgentType, Language, MessageRole

if TYPE_CHECKING:
    from app.models.user import User


class Conversation(Base, UUIDPKMixin, TimestampMixin):
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), default="New conversation", nullable=False)
    agent_type: Mapped[AgentType] = mapped_column(
        Enum(AgentType, name="agent_type"), default=AgentType.TEACHER, nullable=False
    )
    language: Mapped[Language] = mapped_column(
        Enum(Language, name="conversation_language"), default=Language.EN, nullable=False
    )
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    pinned: Mapped[bool] = mapped_column(default=False, nullable=False)
    archived: Mapped[bool] = mapped_column(default=False, nullable=False)
    token_total: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    extra: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="conversations")
    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )


class Message(Base, UUIDPKMixin, TimestampMixin):
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role: Mapped[MessageRole] = mapped_column(Enum(MessageRole, name="message_role"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    agent_type: Mapped[AgentType | None] = mapped_column(
        Enum(AgentType, name="message_agent_type"), nullable=True
    )
    tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tool_calls: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    attachments: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    extra: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    conversation: Mapped[Conversation] = relationship(back_populates="messages")

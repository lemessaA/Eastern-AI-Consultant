"""Chat / conversation schemas."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AgentType, Language, MessageRole


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    role: MessageRole
    content: str
    agent_type: AgentType | None = None
    tokens: int = 0
    attachments: list[dict[str, Any]] | None = None
    created_at: datetime


class ConversationCreate(BaseModel):
    title: str | None = None
    agent_type: AgentType = AgentType.TEACHER
    language: Language = Language.EN


class ConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    agent_type: AgentType
    language: Language
    summary: str | None = None
    pinned: bool
    archived: bool
    created_at: datetime
    updated_at: datetime


class ConversationDetailRead(ConversationRead):
    messages: list[MessageRead] = []


class ChatStreamRequest(BaseModel):
    conversation_id: uuid.UUID | None = None
    message: str = Field(min_length=1, max_length=8000)
    agent_type: AgentType = AgentType.TEACHER
    language: Language = Language.EN
    attachments: list[dict[str, Any]] = []
    use_rag: bool = False

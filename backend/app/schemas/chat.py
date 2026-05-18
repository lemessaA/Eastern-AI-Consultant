"""Chat / conversation schemas."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator

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
    token_total: int = 0
    created_at: datetime
    updated_at: datetime


class ConversationDetailRead(ConversationRead):
    messages: list[MessageRead] = []


class ChatAttachmentMeta(BaseModel):
    """Client sends this shape back on /chat/stream after /chat/upload."""

    filename: str
    mime_type: str
    size_bytes: int
    extracted_text: str = ""


class ChatAttachmentUploadResponse(ChatAttachmentMeta):
    """Response from POST /chat/upload."""


class ChatStreamRequest(BaseModel):
    conversation_id: uuid.UUID | None = None
    message: str = Field(default="", max_length=8000)
    agent_type: AgentType = AgentType.TEACHER
    language: Language = Language.EN
    attachments: list[dict[str, Any]] = []
    use_rag: bool = False

    @model_validator(mode="after")
    def _message_or_attachments(self) -> ChatStreamRequest:
        has_message = bool(self.message.strip())
        has_files = any((a.get("extracted_text") or "").strip() for a in self.attachments)
        if not has_message and not has_files:
            raise ValueError("Provide a message and/or at least one file with readable text.")
        return self

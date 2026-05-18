"""AI chat endpoints: streaming, history, agents directory."""

from __future__ import annotations

import json
import uuid
from collections.abc import AsyncIterator
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, File, HTTPException, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select

from app.agents import AGENT_REGISTRY, get_agent
from app.core.deps import DB, CurrentUser
from app.core.logging import get_logger
from app.langgraph.chat_router import classify_agent
from app.models.chat import Conversation, Message
from app.models.enums import AgentType, Language, MessageRole
from app.core.config import settings
from app.schemas.chat import (
    ChatAttachmentUploadResponse,
    ChatStreamRequest,
    ConversationCreate,
    ConversationDetailRead,
    ConversationRead,
    MessageRead,
)
from app.services.documents import extract_text_from_bytes
from app.schemas.common import MessageResponse
from app.services.rag import get_rag_service

router = APIRouter()
logger = get_logger(__name__)

_CHAT_ALLOWED_SUFFIXES = {".pdf", ".txt", ".csv", ".md", ".doc", ".docx"}
_MAX_ATTACHMENT_TEXT_CHARS = 50_000


def _augment_message_with_attachments(
    message: str, attachments: list[dict[str, Any]] | None
) -> str:
    """Append extracted file text so the model can reason over uploads."""
    parts: list[str] = []
    if message.strip():
        parts.append(message.strip())
    for att in attachments or []:
        text = (att.get("extracted_text") or "").strip()
        if not text:
            continue
        name = att.get("filename") or "attachment"
        snippet = text[:_MAX_ATTACHMENT_TEXT_CHARS]
        parts.append(f"--- Attached file: {name} ---\n{snippet}")
    if not parts:
        return message.strip() or "Please review the attached file(s)."
    return "\n\n".join(parts)


# ---------- Agents directory ------------------------------------------------
@router.get("/agents")
async def list_agents() -> list[dict[str, str]]:
    """Return the catalogue of available AI specialists."""
    return [
        {
            "key": agent_type.value,
            "name": agent.display_name,
            "description": agent.system_prompt(Language.EN, {}).split("\n\n")[0][:240],
        }
        for agent_type, agent in AGENT_REGISTRY.items()
    ]


# ---------- Conversation CRUD ----------------------------------------------
@router.get("/conversations", response_model=list[ConversationRead])
async def list_conversations(
    user: CurrentUser,
    db: DB,
    archived: bool = Query(False),
    limit: int = Query(50, ge=1, le=200),
) -> list[ConversationRead]:
    stmt = (
        select(Conversation)
        .where(Conversation.user_id == user.id, Conversation.archived.is_(archived))
        .order_by(Conversation.updated_at.desc())
        .limit(limit)
    )
    rows = (await db.execute(stmt)).scalars().all()
    return [ConversationRead.model_validate(c) for c in rows]


@router.post("/conversations", response_model=ConversationRead)
async def create_conversation(
    payload: ConversationCreate, user: CurrentUser, db: DB
) -> ConversationRead:
    convo = Conversation(
        user_id=user.id,
        title=payload.title or "New conversation",
        agent_type=payload.agent_type,
        language=payload.language,
    )
    db.add(convo)
    await db.commit()
    await db.refresh(convo)
    return ConversationRead.model_validate(convo)


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailRead)
async def get_conversation(
    conversation_id: uuid.UUID, user: CurrentUser, db: DB
) -> ConversationDetailRead:
    convo = (
        await db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id, Conversation.user_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    msg_rows = (
        await db.execute(
            select(Message)
            .where(Message.conversation_id == convo.id)
            .order_by(Message.created_at)
        )
    ).scalars().all()
    base = ConversationRead.model_validate(convo)
    return ConversationDetailRead(
        **base.model_dump(),
        messages=[MessageRead.model_validate(m) for m in msg_rows],
    )


@router.delete("/conversations/{conversation_id}", response_model=MessageResponse)
async def delete_conversation(
    conversation_id: uuid.UUID, user: CurrentUser, db: DB
) -> MessageResponse:
    convo = (
        await db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id, Conversation.user_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    await db.delete(convo)
    await db.commit()
    return MessageResponse(message="Conversation deleted")


# ---------- File upload for chat --------------------------------------------
@router.post("/upload", response_model=ChatAttachmentUploadResponse)
async def upload_chat_attachment(
    user: CurrentUser,
    file: UploadFile = File(...),
) -> ChatAttachmentUploadResponse:
    """Extract text from a chat attachment (PDF, DOCX, TXT, CSV, MD)."""
    _ = user  # auth gate only
    filename = file.filename or "upload"
    suffix = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if suffix not in _CHAT_ALLOWED_SUFFIXES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(sorted(_CHAT_ALLOWED_SUFFIXES))}",
        )

    data = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(status_code=413, detail="File too large")

    mime = file.content_type or "application/octet-stream"
    extracted = extract_text_from_bytes(data, mime, filename).strip()
    if not extracted:
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from this file. Try PDF, DOCX, TXT, CSV, or MD.",
        )

    return ChatAttachmentUploadResponse(
        filename=filename,
        mime_type=mime,
        size_bytes=len(data),
        extracted_text=extracted[:_MAX_ATTACHMENT_TEXT_CHARS],
    )


# ---------- Streaming chat --------------------------------------------------
async def _build_history(
    db, conversation_id: uuid.UUID, limit: int = 20
) -> list[tuple[MessageRole, str]]:
    stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )
    rows = (await db.execute(stmt)).scalars().all()
    return [(m.role, m.content) for m in reversed(rows)]


async def _stream_response(
    request: ChatStreamRequest,
    user_id: uuid.UUID,
    db,
) -> AsyncIterator[bytes]:
    """Async generator producing Server-Sent Events for the chat stream."""

    # Resolve or create the conversation.
    convo: Conversation | None = None
    if request.conversation_id:
        convo = (
            await db.execute(
                select(Conversation).where(
                    Conversation.id == request.conversation_id,
                    Conversation.user_id == user_id,
                )
            )
        ).scalar_one_or_none()
    if convo is None:
        convo = Conversation(
            user_id=user_id,
            agent_type=request.agent_type,
            language=request.language,
            title=(request.message[:60] if request.message.strip() else None)
            or (
                (request.attachments or [{}])[0].get("filename", "New conversation")[:60]
                if request.attachments
                else "New conversation"
            ),
        )
        db.add(convo)
        await db.flush()

    effective_message = _augment_message_with_attachments(
        request.message, request.attachments
    )

    # Route to the right specialist via LangGraph classifier when the user has
    # not explicitly picked an agent; otherwise honour their choice.
    forced = request.agent_type
    agent_type = await classify_agent(effective_message, forced=forced)
    convo.agent_type = agent_type
    agent = get_agent(agent_type)

    # Persist the user message.
    user_msg = Message(
        conversation_id=convo.id,
        role=MessageRole.USER,
        content=request.message,
        attachments=request.attachments or None,
    )
    db.add(user_msg)
    await db.flush()

    history = await _build_history(db, convo.id)

    # Optional RAG context.
    rag_context = ""
    if request.use_rag:
        rag_context = await get_rag_service().query_as_context(effective_message, k=4)

    context: dict[str, Any] = {"rag": rag_context} if rag_context else {}
    yield _sse_event(
        "meta",
        {
            "conversation_id": str(convo.id),
            "agent_type": agent_type.value,
            "agent_name": agent.display_name,
            "language": request.language.value,
            "rag_used": bool(rag_context),
        },
    )

    collected: list[str] = []
    try:
        async for chunk in agent.stream(
            effective_message,
            history=history,
            language=request.language,
            context=context,
        ):
            collected.append(chunk)
            yield _sse_event("token", {"text": chunk})
    except Exception as exc:  # noqa: BLE001
        logger.exception("chat_stream_failed", error=str(exc))
        yield _sse_event("error", {"message": "Streaming failed."})

    final_text = "".join(collected).strip()

    assistant_msg = Message(
        conversation_id=convo.id,
        role=MessageRole.ASSISTANT,
        content=final_text or "(no response)",
        agent_type=agent_type,
        tokens=len(final_text) // 4,
    )
    db.add(assistant_msg)
    convo.token_total = (convo.token_total or 0) + assistant_msg.tokens
    convo.updated_at = datetime.now(timezone.utc)
    await db.commit()

    yield _sse_event(
        "done",
        {
            "message_id": str(assistant_msg.id),
            "conversation_id": str(convo.id),
            "tokens": assistant_msg.tokens,
        },
    )


def _sse_event(event: str, data: dict[str, Any]) -> bytes:
    payload = json.dumps(data, ensure_ascii=False)
    return f"event: {event}\ndata: {payload}\n\n".encode("utf-8")


@router.post("/stream")
async def chat_stream(
    payload: ChatStreamRequest, user: CurrentUser, db: DB
) -> StreamingResponse:
    """Stream the AI's response as Server-Sent Events."""
    return StreamingResponse(
        _stream_response(payload, user.id, db),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


# ---------- Quick stats -----------------------------------------------------
@router.get("/stats")
async def chat_stats(user: CurrentUser, db: DB) -> dict[str, int]:
    convo_count = (
        await db.execute(
            select(func.count(Conversation.id)).where(Conversation.user_id == user.id)
        )
    ).scalar_one()
    msg_count = (
        await db.execute(
            select(func.count(Message.id))
            .join(Conversation, Message.conversation_id == Conversation.id)
            .where(Conversation.user_id == user.id)
        )
    ).scalar_one()
    token_total = (
        await db.execute(
            select(func.coalesce(func.sum(Conversation.token_total), 0)).where(
                Conversation.user_id == user.id
            )
        )
    ).scalar_one()
    return {
        "conversations": int(convo_count),
        "messages": int(msg_count),
        "tokens": int(token_total),
    }

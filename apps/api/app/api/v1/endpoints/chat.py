"""AI chat endpoints: streaming, history, agents directory."""

from __future__ import annotations

import json
import uuid
from collections.abc import AsyncIterator
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select

from app.agents import AGENT_REGISTRY, get_agent
from app.core.deps import DB, CurrentUser
from app.core.logging import get_logger
from app.langgraph.chat_router import classify_agent
from app.models.chat import Conversation, Message
from app.models.enums import AgentType, Language, MessageRole
from app.schemas.chat import (
    ChatStreamRequest,
    ConversationCreate,
    ConversationDetailRead,
    ConversationRead,
    MessageRead,
)
from app.schemas.common import MessageResponse
from app.services.rag import get_rag_service

router = APIRouter()
logger = get_logger(__name__)


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
    out = ConversationDetailRead.model_validate(convo)
    out.messages = [MessageRead.model_validate(m) for m in msg_rows]
    return out


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
            title=request.message[:60],
        )
        db.add(convo)
        await db.flush()

    # Route to the right specialist via LangGraph classifier when the user has
    # not explicitly picked an agent; otherwise honour their choice.
    forced = request.agent_type
    agent_type = await classify_agent(request.message, forced=forced)
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
        rag_context = await get_rag_service().query_as_context(request.message, k=4)

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
            request.message,
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

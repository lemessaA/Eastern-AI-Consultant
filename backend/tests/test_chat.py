"""Chat API tests (agents, upload, stream, conversations)."""

from __future__ import annotations

import io
import json

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_agents_public(client: AsyncClient):
    res = await client.get("/api/v1/chat/agents")
    assert res.status_code == 200
    agents = res.json()
    assert len(agents) >= 10
    assert all("key" in a and "name" in a for a in agents)


@pytest.mark.asyncio
async def test_stream_requires_auth(client: AsyncClient):
    res = await client.post(
        "/api/v1/chat/stream",
        json={"message": "Hello"},
    )
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_upload_requires_auth(client: AsyncClient):
    res = await client.post(
        "/api/v1/chat/upload",
        files={"file": ("note.txt", b"Sample document text for chat.", "text/plain")},
    )
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_upload_extracts_text(client: AsyncClient, auth_headers: dict):
    res = await client.post(
        "/api/v1/chat/upload",
        headers=auth_headers,
        files={"file": ("note.txt", b"Eastern AI sample content.", "text/plain")},
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["filename"] == "note.txt"
    assert "Eastern AI" in body["extracted_text"]


@pytest.mark.asyncio
async def test_stream_sse_mocked(client: AsyncClient, auth_headers: dict, mock_chat_llm):
    res = await client.post(
        "/api/v1/chat/stream",
        headers=auth_headers,
        json={"message": "What is AI?", "agent_type": "teacher", "language": "en"},
    )
    assert res.status_code == 200, res.text
    assert "text/event-stream" in res.headers.get("content-type", "")

    raw = res.text
    assert "event: meta" in raw
    assert "event: token" in raw
    assert "event: done" in raw
    assert "Test response" in raw or "Test " in raw

    # Parse done payload for conversation id
    conv_id = None
    for block in raw.split("\n\n"):
        if "event: meta" in block:
            for line in block.split("\n"):
                if line.startswith("data: "):
                    meta = json.loads(line[6:])
                    conv_id = meta.get("conversation_id")
    assert conv_id

    # History should include user + assistant messages
    detail = await client.get(
        f"/api/v1/chat/conversations/{conv_id}",
        headers=auth_headers,
    )
    assert detail.status_code == 200
    messages = detail.json()["messages"]
    assert len(messages) >= 2
    assert messages[0]["role"] == "user"
    assert messages[-1]["role"] == "assistant"
    assert "Test" in messages[-1]["content"]


@pytest.mark.asyncio
async def test_stream_with_attachment_mocked(
    client: AsyncClient, auth_headers: dict, mock_chat_llm
):
    res = await client.post(
        "/api/v1/chat/stream",
        headers=auth_headers,
        json={
            "message": "Summarize this file",
            "attachments": [
                {
                    "filename": "doc.txt",
                    "mime_type": "text/plain",
                    "size_bytes": 20,
                    "extracted_text": "Revenue grew 40% in Q1.",
                }
            ],
        },
    )
    assert res.status_code == 200, res.text
    assert "event: done" in res.text


@pytest.mark.asyncio
async def test_stream_rejects_empty_payload(client: AsyncClient, auth_headers: dict):
    res = await client.post(
        "/api/v1/chat/stream",
        headers=auth_headers,
        json={"message": "", "attachments": []},
    )
    assert res.status_code == 422

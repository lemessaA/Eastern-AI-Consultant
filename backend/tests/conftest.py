"""Shared pytest fixtures for API tests."""

from __future__ import annotations

import uuid
from collections.abc import AsyncIterator

import pytest
from httpx import ASGITransport, AsyncClient

from app.agents.base import BaseAgent
from app.main import app
from app.models.enums import AgentType, Language, MessageRole


class _FakeAgent(BaseAgent):
    """Deterministic agent for tests (no external LLM calls)."""

    @property
    def agent_type(self) -> AgentType:
        return AgentType.TEACHER

    @property
    def display_name(self) -> str:
        return "Test Teacher"

    def system_prompt(self, language: Language, context: dict | None = None) -> str:
        return "You are a test agent."

    async def stream(
        self,
        user_message: str,
        history=(),
        language: Language = Language.EN,
        context: dict | None = None,
    ) -> AsyncIterator[str]:
        yield "Test "
        yield "response."


@pytest.fixture
def mock_chat_llm(monkeypatch):
    """Patch classifier + agent so /chat/stream never calls Groq."""

    async def _classify(user_message: str, forced: AgentType | None = None) -> AgentType:
        return forced or AgentType.TEACHER

    def _get_agent(agent_type: AgentType) -> BaseAgent:
        return _FakeAgent()

    monkeypatch.setattr("app.api.v1.endpoints.chat.classify_agent", _classify)
    monkeypatch.setattr("app.api.v1.endpoints.chat.get_agent", _get_agent)


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def auth_headers(client: AsyncClient) -> dict[str, str]:
    email = f"chat-test-{uuid.uuid4().hex[:12]}@example.com"
    password = "ChatTest123!"
    reg = await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Chat Tester",
        },
    )
    assert reg.status_code == 201, reg.text
    token = reg.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

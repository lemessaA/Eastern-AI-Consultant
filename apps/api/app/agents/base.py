"""Base agent abstraction.

Every domain agent is a thin subclass that supplies:
  * a system prompt (multilingual-aware),
  * the LLM tier to use,
  * optional tools.

The base class implements the streaming chat contract used by the FastAPI
endpoints and the LangGraph orchestration layer.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator, Iterable
from dataclasses import dataclass, field
from typing import Any

from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
)

from app.core.logging import get_logger
from app.models.enums import AgentType, Language, MessageRole
from app.services.llm import ModelTier, get_chat_model

logger = get_logger(__name__)


LANGUAGE_INSTRUCTIONS: dict[Language, str] = {
    Language.EN: "Reply in clear, professional English suitable for African business and student audiences.",
    Language.AM: "በቀላል፣ ሙያዊ አማርኛ ይመልሱ። ለኢትዮጵያ ተማሪዎችና ሥራ ፈጣሪዎች የሚስማማ ይዘት ያቅርቡ።",
    Language.OM: "Afaan Oromoo salphaa fi ogummaa qabuun deebii kenni. Daldaltootaa fi barattoota Itoophiyaaf mijaa'aa ta'i.",
    Language.SO: "Ku jawaab Af-Soomaali sahlan oo xirfadlaysan, ku habboon ardayda iyo ganacsatada Geeska Afrika.",
}


@dataclass(slots=True)
class AgentResponse:
    """Result returned by a non-streaming agent invocation."""

    content: str
    agent_type: AgentType
    tokens: int = 0
    tool_calls: list[dict[str, Any]] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


def build_messages(
    system_prompt: str,
    history: Iterable[tuple[MessageRole, str]] = (),
    user_message: str | None = None,
) -> list[BaseMessage]:
    """Translate (role, content) tuples into LangChain message objects."""

    messages: list[BaseMessage] = [SystemMessage(content=system_prompt)]
    for role, content in history:
        if role == MessageRole.USER:
            messages.append(HumanMessage(content=content))
        elif role == MessageRole.ASSISTANT:
            messages.append(AIMessage(content=content))
        elif role == MessageRole.SYSTEM:
            messages.append(SystemMessage(content=content))
    if user_message is not None:
        messages.append(HumanMessage(content=user_message))
    return messages


class BaseAgent(ABC):
    """Abstract agent. Subclasses must implement :attr:`agent_type` and :meth:`system_prompt`."""

    tier: ModelTier = "balanced"
    temperature: float = 0.4

    @property
    @abstractmethod
    def agent_type(self) -> AgentType: ...

    @property
    @abstractmethod
    def display_name(self) -> str: ...

    @abstractmethod
    def system_prompt(self, language: Language, context: dict[str, Any] | None = None) -> str:
        """Return the localised system prompt for this agent."""

    # ----- Public API ----------------------------------------------------
    async def stream(
        self,
        user_message: str,
        history: Iterable[tuple[MessageRole, str]] = (),
        language: Language = Language.EN,
        context: dict[str, Any] | None = None,
    ) -> AsyncIterator[str]:
        """Stream the agent's response token-by-token as plain strings."""

        prompt = self._compose_prompt(language, context)
        messages = build_messages(prompt, history, user_message)
        model = get_chat_model(tier=self.tier, temperature=self.temperature, streaming=True)

        try:
            async for chunk in model.astream(messages):
                text = getattr(chunk, "content", "") or ""
                if text:
                    yield text
        except Exception as exc:
            logger.exception("agent_stream_failed", agent=self.agent_type.value, error=str(exc))
            yield (
                "\n\n[The AI service is temporarily unavailable. "
                "Please verify your GROQ_API_KEY and try again.]"
            )

    async def invoke(
        self,
        user_message: str,
        history: Iterable[tuple[MessageRole, str]] = (),
        language: Language = Language.EN,
        context: dict[str, Any] | None = None,
    ) -> AgentResponse:
        """Single-shot agent call returning a complete response."""

        prompt = self._compose_prompt(language, context)
        messages = build_messages(prompt, history, user_message)
        model = get_chat_model(tier=self.tier, temperature=self.temperature, streaming=False)
        try:
            result = await model.ainvoke(messages)
            content = getattr(result, "content", "") or ""
            return AgentResponse(content=content, agent_type=self.agent_type, tokens=len(content) // 4)
        except Exception as exc:
            logger.exception("agent_invoke_failed", agent=self.agent_type.value, error=str(exc))
            return AgentResponse(
                content="The AI service is temporarily unavailable.",
                agent_type=self.agent_type,
                metadata={"error": str(exc)},
            )

    # ----- Internal ------------------------------------------------------
    def _compose_prompt(self, language: Language, context: dict[str, Any] | None) -> str:
        base = self.system_prompt(language, context or {})
        lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS[Language.EN])
        footer = (
            "\n\n--- Output rules ---\n"
            f"{lang_instruction}\n"
            "Format answers with clear Markdown: short sections, headings (##), and bullet lists when helpful.\n"
            "Use realistic examples from the East-African / Ethiopian context where appropriate.\n"
            "Never invent facts — if unsure, say so honestly.\n"
            "Always tie advice back to practical, low-bandwidth, mobile-first realities."
        )
        return base + footer

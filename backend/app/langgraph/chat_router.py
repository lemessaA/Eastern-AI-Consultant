"""LangGraph workflow that routes a user message to the right specialist agent.

Flow:
  classify → (optional RAG retrieval) → specialist agent → answer

The classifier is a tiny call to the fast Llama 3.1 8B model; the specialist
agent uses the rich personas defined in :mod:`app.agents.personas`.
"""

from __future__ import annotations

from typing import Annotated, Any, TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

from app.agents import get_agent
from app.core.logging import get_logger
from app.models.enums import AgentType, Language, MessageRole
from app.services.llm import get_chat_model

logger = get_logger(__name__)


class ChatState(TypedDict, total=False):
    user_message: str
    history: list[tuple[MessageRole, str]]
    language: Language
    agent_type: AgentType
    forced_agent: AgentType | None
    rag_context: str | None
    answer: Annotated[str, "Final response"]
    metadata: dict[str, Any]


_CLASSIFIER_PROMPT = """You are an intent classifier for an AI consulting platform.
Read the user's message and pick ONE specialist that should answer.

Options (return exactly one of these tokens):
- teacher                — general AI / prompt-engineering / tutorials
- business_consultant    — SME strategy, SWOT, growth, operations
- agriculture            — crops, livestock, farming, weather, pest control
- marketing              — social media, ads, copy, brand
- career_coach           — resumes, LinkedIn, interviews, remote work
- automation             — workflows, WhatsApp/email bots, no-code
- resume_builder         — explicit resume writing/rewriting
- translator             — translation between EN/AM/OM/SO
- student_tutor          — homework, exam prep, school subjects
- startup_advisor        — pitch decks, MVPs, fundraising

Respond with ONLY the token, no punctuation, no explanation."""


async def _classify_node(state: ChatState) -> dict[str, Any]:
    if state.get("forced_agent"):
        return {"agent_type": state["forced_agent"]}

    model = get_chat_model(tier="fast", temperature=0.0, streaming=False)
    try:
        result = await model.ainvoke(
            [
                SystemMessage(content=_CLASSIFIER_PROMPT),
                HumanMessage(content=state["user_message"]),
            ]
        )
        token = (getattr(result, "content", "") or "").strip().lower().split()[0]
        try:
            return {"agent_type": AgentType(token)}
        except ValueError:
            logger.info("classifier_unknown_token", token=token)
            return {"agent_type": AgentType.TEACHER}
    except Exception as exc:
        logger.warning("classifier_failed", error=str(exc))
        return {"agent_type": AgentType.TEACHER}


async def _answer_node(state: ChatState) -> dict[str, Any]:
    """Non-streaming answer path — useful for unit tests and async jobs.

    Streaming responses are handled directly in the chat endpoint, which
    bypasses LangGraph and calls the agent's ``stream`` method to keep
    latency low.
    """
    agent = get_agent(state["agent_type"])
    context: dict[str, Any] = {}
    if state.get("rag_context"):
        context["rag"] = state["rag_context"]
    response = await agent.invoke(
        state["user_message"],
        history=state.get("history", []),
        language=state.get("language", Language.EN),
        context=context,
    )
    return {"answer": response.content, "metadata": {"tokens": response.tokens}}


def build_chat_graph() -> Any:
    """Compile and return the LangGraph workflow."""
    graph: StateGraph = StateGraph(ChatState)
    graph.add_node("classify", _classify_node)
    graph.add_node("answer", _answer_node)
    graph.add_edge(START, "classify")
    graph.add_edge("classify", "answer")
    graph.add_edge("answer", END)
    return graph.compile()


async def classify_agent(
    user_message: str,
    forced: AgentType | None = None,
) -> AgentType:
    """Standalone classifier — used by the streaming endpoint."""
    state: ChatState = {"user_message": user_message, "forced_agent": forced}
    out = await _classify_node(state)
    return out["agent_type"]

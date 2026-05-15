"""Multi-agent system powered by LangChain + LangGraph.

Each agent is a specialised assistant focused on a single domain
(e.g. business consulting, agriculture, marketing). Agents share a common
:class:`BaseAgent` interface and are exposed via :func:`get_agent`.
"""

from app.agents.base import AgentResponse, BaseAgent, build_messages
from app.agents.registry import AGENT_REGISTRY, get_agent

__all__ = [
    "AGENT_REGISTRY",
    "AgentResponse",
    "BaseAgent",
    "build_messages",
    "get_agent",
]

"""Agent registry — maps :class:`AgentType` to a concrete agent instance."""

from __future__ import annotations

from app.agents.base import BaseAgent
from app.agents.personas import (
    AgricultureAgent,
    AutomationAgent,
    BusinessConsultantAgent,
    CareerCoachAgent,
    MarketingAgent,
    ResumeBuilderAgent,
    StartupAdvisorAgent,
    StudentTutorAgent,
    TeacherAgent,
    TranslatorAgent,
)
from app.models.enums import AgentType

AGENT_REGISTRY: dict[AgentType, BaseAgent] = {
    AgentType.TEACHER: TeacherAgent(),
    AgentType.BUSINESS_CONSULTANT: BusinessConsultantAgent(),
    AgentType.AGRICULTURE: AgricultureAgent(),
    AgentType.MARKETING: MarketingAgent(),
    AgentType.CAREER_COACH: CareerCoachAgent(),
    AgentType.AUTOMATION: AutomationAgent(),
    AgentType.RESUME_BUILDER: ResumeBuilderAgent(),
    AgentType.TRANSLATOR: TranslatorAgent(),
    AgentType.STUDENT_TUTOR: StudentTutorAgent(),
    AgentType.STARTUP_ADVISOR: StartupAdvisorAgent(),
}


def get_agent(agent_type: AgentType) -> BaseAgent:
    """Return the cached agent instance for the given type."""
    agent = AGENT_REGISTRY.get(agent_type)
    if agent is None:
        raise KeyError(f"Unknown agent type: {agent_type}")
    return agent

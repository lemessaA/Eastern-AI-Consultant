"""LangGraph workflow generating a full Business AI Report.

Stages:
  1. **diagnose**   — Business Consultant agent summarises the situation.
  2. **swot**       — same agent produces a structured SWOT.
  3. **automate**   — Automation Expert proposes an automation roadmap.
  4. **market**     — Marketing Assistant drafts a 30-day plan.
  5. **synthesize** — Business Consultant merges everything into a final report.
"""

from __future__ import annotations

import json
from typing import Any, TypedDict

from langgraph.graph import END, START, StateGraph

from app.agents import get_agent
from app.core.logging import get_logger
from app.models.enums import AgentType, Language, ReportType

logger = get_logger(__name__)


class AnalysisState(TypedDict, total=False):
    business: dict[str, Any]
    language: Language
    focus_areas: list[str]
    additional_context: str
    report_type: ReportType
    diagnosis: str
    swot: str
    automation_plan: str
    marketing_plan: str
    final_report: dict[str, Any]


async def _diagnose(state: AnalysisState) -> dict[str, Any]:
    agent = get_agent(AgentType.BUSINESS_CONSULTANT)
    prompt = (
        "Read the business profile in your system context and produce a concise "
        "**Diagnosis** section (max 250 words):\n"
        "- Current stage\n- Primary opportunities\n- Top 3 risks\n- Quick wins (next 7 days)"
    )
    if state.get("additional_context"):
        prompt += f"\n\nAdditional context:\n{state['additional_context']}"
    resp = await agent.invoke(
        prompt, language=state.get("language", Language.EN), context={"business": state["business"]}
    )
    return {"diagnosis": resp.content}


async def _swot(state: AnalysisState) -> dict[str, Any]:
    agent = get_agent(AgentType.BUSINESS_CONSULTANT)
    prompt = (
        "Produce a **SWOT analysis** as a markdown table with 4 columns "
        "(Strengths | Weaknesses | Opportunities | Threats), 3-5 items each. "
        "Be specific to this business."
    )
    resp = await agent.invoke(
        prompt, language=state.get("language", Language.EN), context={"business": state["business"]}
    )
    return {"swot": resp.content}


async def _automation(state: AnalysisState) -> dict[str, Any]:
    agent = get_agent(AgentType.AUTOMATION)
    prompt = (
        "Design a **90-day automation roadmap** for this business. "
        "List 6-10 concrete automations, each with: name, tool, monthly cost (USD), "
        "setup time, expected ROI."
    )
    resp = await agent.invoke(
        prompt, language=state.get("language", Language.EN), context={"business": state["business"]}
    )
    return {"automation_plan": resp.content}


async def _marketing(state: AnalysisState) -> dict[str, Any]:
    agent = get_agent(AgentType.MARKETING)
    prompt = (
        "Write a **30-day marketing plan** for this business: weekly themes, "
        "channels (WhatsApp / Facebook / TikTok / local radio), 3 sample posts, "
        "and KPIs to track."
    )
    resp = await agent.invoke(
        prompt, language=state.get("language", Language.EN), context={"business": state["business"]}
    )
    return {"marketing_plan": resp.content}


async def _synthesize(state: AnalysisState) -> dict[str, Any]:
    """Combine every section into the final report payload."""
    biz = state["business"]
    title = f"AI Business Report — {biz.get('name', 'Untitled')}"
    sections = {
        "diagnosis": state.get("diagnosis", ""),
        "swot": state.get("swot", ""),
        "automation_plan": state.get("automation_plan", ""),
        "marketing_plan": state.get("marketing_plan", ""),
    }
    summary_lines = [
        f"Industry: {biz.get('industry', 'N/A')}",
        f"Location: {biz.get('city', '')}, {biz.get('country', '')}",
        f"Focus areas: {', '.join(state.get('focus_areas') or ['general growth'])}",
    ]
    return {
        "final_report": {
            "title": title,
            "summary": " | ".join(summary_lines),
            "sections": sections,
            "raw": json.dumps(sections),
        }
    }


def _build_graph() -> Any:
    """Wire the multi-agent workflow.

    Node names are deliberately distinct from :class:`AnalysisState` keys —
    LangGraph 0.2.53+ uses the same namespace for both and rejects collisions
    (e.g. node ``"swot"`` would clash with state key ``swot``).
    """
    graph: StateGraph = StateGraph(AnalysisState)
    graph.add_node("diagnose_step", _diagnose)
    graph.add_node("swot_step", _swot)
    graph.add_node("automation_step", _automation)
    graph.add_node("marketing_step", _marketing)
    graph.add_node("synthesize_step", _synthesize)

    graph.add_edge(START, "diagnose_step")
    graph.add_edge("diagnose_step", "swot_step")
    graph.add_edge("swot_step", "automation_step")
    graph.add_edge("automation_step", "marketing_step")
    graph.add_edge("marketing_step", "synthesize_step")
    graph.add_edge("synthesize_step", END)
    return graph.compile()


_GRAPH = None


async def run_business_analysis(
    business: dict[str, Any],
    language: Language = Language.EN,
    focus_areas: list[str] | None = None,
    additional_context: str | None = None,
    report_type: ReportType = ReportType.BUSINESS_ANALYSIS,
) -> dict[str, Any]:
    """Execute the multi-agent business analysis workflow end-to-end."""
    global _GRAPH
    if _GRAPH is None:
        _GRAPH = _build_graph()
    initial: AnalysisState = {
        "business": business,
        "language": language,
        "focus_areas": focus_areas or [],
        "additional_context": additional_context or "",
        "report_type": report_type,
    }
    try:
        result = await _GRAPH.ainvoke(initial)
        return result.get("final_report", {})
    except Exception as exc:
        logger.exception("business_analysis_failed", error=str(exc))
        return {
            "title": "Business analysis (partial)",
            "summary": "The analysis could not be fully generated.",
            "sections": {"error": str(exc)},
        }

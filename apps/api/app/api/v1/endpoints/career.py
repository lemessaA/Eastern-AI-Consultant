"""AI Career Coach endpoints."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.agents import get_agent
from app.core.deps import CurrentUser
from app.models.enums import AgentType, Language

router = APIRouter()


class ResumeBuildRequest(BaseModel):
    target_role: str = Field(min_length=2, max_length=200)
    experience_summary: str = Field(min_length=20, max_length=8000)
    skills: list[str] = []
    job_description: str | None = None
    language: Language = Language.EN


class CoverLetterRequest(BaseModel):
    job_description: str
    candidate_summary: str
    tone: str = "professional"
    language: Language = Language.EN


class InterviewSimRequest(BaseModel):
    role: str
    seniority: str = "junior"
    focus: str = "behavioural"
    language: Language = Language.EN


class SkillAssessmentRequest(BaseModel):
    current_skills: list[str]
    career_goal: str
    horizon_months: int = 6
    language: Language = Language.EN


@router.post("/resume")
async def build_resume(payload: ResumeBuildRequest, user: CurrentUser) -> dict:
    agent = get_agent(AgentType.RESUME_BUILDER)
    prompt = (
        f"Build an ATS-friendly resume for the role: **{payload.target_role}**.\n"
        f"Candidate experience:\n{payload.experience_summary}\n"
        f"Candidate skills: {', '.join(payload.skills)}\n"
        f"{('Target job description:\n' + payload.job_description) if payload.job_description else ''}"
    )
    response = await agent.invoke(prompt, language=payload.language)
    return {"resume_markdown": response.content}


@router.post("/cover-letter")
async def cover_letter(payload: CoverLetterRequest, user: CurrentUser) -> dict:
    agent = get_agent(AgentType.CAREER_COACH)
    prompt = (
        f"Write a {payload.tone} cover letter (max 250 words) for this candidate.\n\n"
        f"Job description:\n{payload.job_description}\n\n"
        f"Candidate summary:\n{payload.candidate_summary}"
    )
    response = await agent.invoke(prompt, language=payload.language)
    return {"cover_letter": response.content}


@router.post("/interview-sim")
async def interview_simulation(payload: InterviewSimRequest, user: CurrentUser) -> dict:
    agent = get_agent(AgentType.CAREER_COACH)
    prompt = (
        f"Simulate a {payload.focus} interview for a {payload.seniority} {payload.role}. "
        "Provide 7 high-quality questions plus a one-sentence model answer for each."
    )
    response = await agent.invoke(prompt, language=payload.language)
    return {"interview_pack": response.content}


@router.post("/skill-assessment")
async def skill_assessment(payload: SkillAssessmentRequest, user: CurrentUser) -> dict:
    agent = get_agent(AgentType.CAREER_COACH)
    prompt = (
        f"Career goal: {payload.career_goal}\n"
        f"Current skills: {', '.join(payload.current_skills)}\n"
        f"Horizon: {payload.horizon_months} months.\n\n"
        "Output: skill gap analysis + a month-by-month roadmap with free/cheap resources."
    )
    response = await agent.invoke(prompt, language=payload.language)
    return {"plan": response.content}

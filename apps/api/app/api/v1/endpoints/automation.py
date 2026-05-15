"""Automation Center endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select

from app.agents import get_agent
from app.core.deps import DB, CurrentUser
from app.models.ai import Automation
from app.models.enums import AgentType, AutomationStatus, AutomationType, Language


class AutomationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    description: str | None = None
    automation_type: AutomationType
    business_id: uuid.UUID | None = None
    trigger: dict = {}
    actions: list[dict] = []
    config: dict = {}


class AutomationRead(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    automation_type: AutomationType
    status: AutomationStatus
    trigger: dict
    actions: list[dict]
    config: dict
    run_count: int

    class Config:
        from_attributes = True


class TemplateRequest(BaseModel):
    automation_type: AutomationType
    business_context: str = Field(min_length=10, max_length=2000)
    language: Language = Language.EN


router = APIRouter()


_TEMPLATES = [
    {
        "key": "whatsapp_faq",
        "name": "WhatsApp FAQ Bot",
        "type": AutomationType.WHATSAPP,
        "description": "Auto-answer your 20 most common WhatsApp questions 24/7.",
        "setup_minutes": 30,
        "monthly_cost_usd": 12,
    },
    {
        "key": "appointment_booking",
        "name": "Appointment Booking Assistant",
        "type": AutomationType.APPOINTMENT,
        "description": "Customers book slots via WhatsApp or website; you get notified.",
        "setup_minutes": 45,
        "monthly_cost_usd": 15,
    },
    {
        "key": "lead_capture",
        "name": "Lead Capture → CRM",
        "type": AutomationType.LEAD,
        "description": "Capture leads from any form and push them into a CRM with AI scoring.",
        "setup_minutes": 60,
        "monthly_cost_usd": 19,
    },
    {
        "key": "invoice_generator",
        "name": "AI Invoice Generator",
        "type": AutomationType.INVOICE,
        "description": "Generate branded invoices from a single WhatsApp message.",
        "setup_minutes": 20,
        "monthly_cost_usd": 9,
    },
    {
        "key": "social_post",
        "name": "Daily Social Post",
        "type": AutomationType.SOCIAL,
        "description": "Auto-publish a localised social post each morning at 8am.",
        "setup_minutes": 25,
        "monthly_cost_usd": 8,
    },
    {
        "key": "customer_support_bot",
        "name": "Customer Support Chatbot",
        "type": AutomationType.CHATBOT,
        "description": "Handle 70% of support tickets with an AI agent + handoff to humans.",
        "setup_minutes": 90,
        "monthly_cost_usd": 29,
    },
]


@router.get("/templates")
async def list_templates() -> list[dict]:
    return _TEMPLATES


@router.post("/templates/generate")
async def generate_template(payload: TemplateRequest, user: CurrentUser) -> dict:
    """Use the Automation Expert agent to design a workflow."""
    agent = get_agent(AgentType.AUTOMATION)
    prompt = (
        f"Design a {payload.automation_type.value} automation for the following "
        f"business context. Be concrete and prescriptive.\n\n"
        f"Business context:\n{payload.business_context}"
    )
    response = await agent.invoke(prompt, language=payload.language)
    return {
        "automation_type": payload.automation_type.value,
        "blueprint": response.content,
    }


@router.get("", response_model=list[AutomationRead])
async def list_automations(user: CurrentUser, db: DB) -> list[AutomationRead]:
    rows = (
        await db.execute(
            select(Automation)
            .where(Automation.user_id == user.id)
            .order_by(Automation.created_at.desc())
        )
    ).scalars().all()
    return [AutomationRead.model_validate(a) for a in rows]


@router.post("", response_model=AutomationRead, status_code=201)
async def create_automation(
    payload: AutomationCreate, user: CurrentUser, db: DB
) -> AutomationRead:
    auto = Automation(user_id=user.id, **payload.model_dump())
    db.add(auto)
    await db.commit()
    await db.refresh(auto)
    return AutomationRead.model_validate(auto)


@router.post("/{automation_id}/toggle", response_model=AutomationRead)
async def toggle_automation(
    automation_id: uuid.UUID, user: CurrentUser, db: DB
) -> AutomationRead:
    auto = (
        await db.execute(
            select(Automation).where(
                Automation.id == automation_id, Automation.user_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not auto:
        raise HTTPException(status_code=404, detail="Automation not found")
    auto.status = (
        AutomationStatus.PAUSED if auto.status == AutomationStatus.ACTIVE else AutomationStatus.ACTIVE
    )
    await db.commit()
    await db.refresh(auto)
    return AutomationRead.model_validate(auto)

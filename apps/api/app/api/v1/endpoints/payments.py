"""Subscriptions and payments."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select

from app.core.deps import DB, CurrentUser
from app.models.enums import SubscriptionPlan, SubscriptionStatus
from app.models.payment import Subscription
from app.schemas.common import MessageResponse

router = APIRouter()


class PlanInfo(BaseModel):
    plan: SubscriptionPlan
    monthly_price_usd: float
    features: list[str]
    highlight: str | None = None


PLANS: list[PlanInfo] = [
    PlanInfo(
        plan=SubscriptionPlan.FREE,
        monthly_price_usd=0,
        features=[
            "Access to the AI Teacher",
            "5 free courses",
            "10 AI chat messages / day",
            "Community forum",
        ],
    ),
    PlanInfo(
        plan=SubscriptionPlan.PRO,
        monthly_price_usd=19,
        highlight="Most popular",
        features=[
            "All AI agents (Business, Marketing, Career…)",
            "Unlimited AI chat",
            "All 50+ courses + certificates",
            "Business analysis & SWOT reports",
            "Automation Center (10 active flows)",
            "Priority Groq inference",
        ],
    ),
    PlanInfo(
        plan=SubscriptionPlan.ENTERPRISE,
        monthly_price_usd=149,
        features=[
            "Everything in Pro",
            "Custom AI agents for your business",
            "Dedicated consultant (4h / month)",
            "Unlimited automations",
            "Private vector knowledge base",
            "SSO + audit logs + SLA",
        ],
    ),
]


@router.get("/plans")
async def list_plans() -> list[PlanInfo]:
    return PLANS


@router.get("/subscription")
async def my_subscription(user: CurrentUser, db: DB) -> dict:
    sub = (
        await db.execute(
            select(Subscription)
            .where(Subscription.user_id == user.id)
            .order_by(Subscription.created_at.desc())
            .limit(1)
        )
    ).scalar_one_or_none()
    if not sub:
        return {"plan": SubscriptionPlan.FREE.value, "status": "active"}
    return {
        "plan": sub.plan.value,
        "status": sub.status.value,
        "current_period_end": sub.current_period_end.isoformat() if sub.current_period_end else None,
        "cancel_at_period_end": sub.cancel_at_period_end,
    }


class CheckoutRequest(BaseModel):
    plan: SubscriptionPlan


@router.post("/checkout")
async def create_checkout(payload: CheckoutRequest, user: CurrentUser, db: DB) -> dict:
    """Stub — in production this would create a Stripe Checkout Session."""
    sub = Subscription(
        user_id=user.id,
        plan=payload.plan,
        status=SubscriptionStatus.TRIALING,
    )
    db.add(sub)
    await db.commit()
    return {
        "message": "Checkout would redirect to Stripe in production.",
        "plan": payload.plan.value,
        "subscription_id": str(sub.id),
    }


@router.post("/cancel", response_model=MessageResponse)
async def cancel_subscription(user: CurrentUser, db: DB) -> MessageResponse:
    sub = (
        await db.execute(
            select(Subscription)
            .where(
                Subscription.user_id == user.id,
                Subscription.status == SubscriptionStatus.ACTIVE,
            )
            .limit(1)
        )
    ).scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription")
    sub.cancel_at_period_end = True
    await db.commit()
    return MessageResponse(message="Subscription will cancel at period end.")

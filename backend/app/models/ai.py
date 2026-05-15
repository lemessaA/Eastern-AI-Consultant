"""AI artefacts: generated reports and automation workflows."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPKMixin
from app.models.enums import AutomationStatus, AutomationType, Language, ReportType

if TYPE_CHECKING:
    from app.models.business import Business
    from app.models.user import User


class AIReport(Base, UUIDPKMixin, TimestampMixin):
    __tablename__ = "ai_reports"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    business_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True
    )
    report_type: Mapped[ReportType] = mapped_column(
        Enum(ReportType, name="report_type"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    language: Mapped[Language] = mapped_column(
        Enum(Language, name="report_language"), default=Language.EN, nullable=False
    )
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    pdf_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    user: Mapped["User"] = relationship()
    business: Mapped["Business | None"] = relationship(back_populates="reports")


class Automation(Base, UUIDPKMixin, TimestampMixin):
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    business_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    automation_type: Mapped[AutomationType] = mapped_column(
        Enum(AutomationType, name="automation_type"), nullable=False
    )
    status: Mapped[AutomationStatus] = mapped_column(
        Enum(AutomationStatus, name="automation_status"), default=AutomationStatus.DRAFT, nullable=False
    )
    config: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    trigger: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    actions: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)
    last_run_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    run_count: Mapped[int] = mapped_column(default=0, nullable=False)

    runs: Mapped[list["AutomationRun"]] = relationship(
        back_populates="automation", cascade="all, delete-orphan"
    )


class AutomationRun(Base, UUIDPKMixin, TimestampMixin):
    __tablename__ = "automation_runs"

    automation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("automations.id", ondelete="CASCADE"), nullable=False
    )
    success: Mapped[bool] = mapped_column(default=True, nullable=False)
    input_payload: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    output_payload: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_ms: Mapped[int] = mapped_column(default=0, nullable=False)

    automation: Mapped[Automation] = relationship(back_populates="runs")

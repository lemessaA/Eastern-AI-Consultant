"""Business + business analysis schemas."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import Language, ReportType


class BusinessBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str = Field(min_length=2, max_length=200)
    industry: str | None = None
    description: str | None = None
    country: str | None = None
    city: str | None = None
    website: str | None = None
    employees: int | None = None
    annual_revenue_usd: int | None = None
    primary_language: Language = Language.EN
    goals: list[str] = []
    challenges: list[str] = []


class BusinessCreate(BusinessBase):
    pass


class BusinessUpdate(BaseModel):
    name: str | None = None
    industry: str | None = None
    description: str | None = None
    country: str | None = None
    city: str | None = None
    website: str | None = None
    employees: int | None = None
    annual_revenue_usd: int | None = None
    primary_language: Language | None = None
    goals: list[str] | None = None
    challenges: list[str] | None = None


class BusinessRead(BusinessBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class BusinessDocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    filename: str
    mime_type: str
    size_bytes: int
    indexed: bool
    created_at: datetime


class BusinessAnalysisRequest(BaseModel):
    business_id: uuid.UUID
    report_type: ReportType = ReportType.BUSINESS_ANALYSIS
    language: Language = Language.EN
    focus_areas: list[str] = []
    additional_context: str | None = None


class BusinessAnalysisResponse(BaseModel):
    report_id: uuid.UUID
    report_type: ReportType
    title: str
    summary: str
    content: dict[str, Any]
    pdf_url: str | None = None
    created_at: datetime

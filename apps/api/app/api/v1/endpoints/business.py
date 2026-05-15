"""Business profile + AI analysis endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from sqlalchemy import select

from app.core.config import settings
from app.core.deps import DB, CurrentUser
from app.core.logging import get_logger
from app.langgraph import run_business_analysis
from app.models.ai import AIReport
from app.models.business import Business, BusinessDocument
from app.schemas.business import (
    BusinessAnalysisRequest,
    BusinessAnalysisResponse,
    BusinessCreate,
    BusinessDocumentRead,
    BusinessRead,
    BusinessUpdate,
)
from app.services.documents import extract_text_from_bytes
from app.services.rag import get_rag_service
from app.services.storage import get_storage

router = APIRouter()
logger = get_logger(__name__)


@router.get("", response_model=list[BusinessRead])
async def list_my_businesses(user: CurrentUser, db: DB) -> list[BusinessRead]:
    rows = (
        await db.execute(
            select(Business)
            .where(Business.owner_id == user.id)
            .order_by(Business.created_at.desc())
        )
    ).scalars().all()
    return [BusinessRead.model_validate(b) for b in rows]


@router.post("", response_model=BusinessRead, status_code=201)
async def create_business(
    payload: BusinessCreate, user: CurrentUser, db: DB
) -> BusinessRead:
    business = Business(owner_id=user.id, **payload.model_dump())
    db.add(business)
    await db.commit()
    await db.refresh(business)
    return BusinessRead.model_validate(business)


@router.get("/{business_id}", response_model=BusinessRead)
async def get_business(business_id: uuid.UUID, user: CurrentUser, db: DB) -> BusinessRead:
    biz = (
        await db.execute(
            select(Business).where(
                Business.id == business_id, Business.owner_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    return BusinessRead.model_validate(biz)


@router.patch("/{business_id}", response_model=BusinessRead)
async def update_business(
    business_id: uuid.UUID, payload: BusinessUpdate, user: CurrentUser, db: DB
) -> BusinessRead:
    biz = (
        await db.execute(
            select(Business).where(
                Business.id == business_id, Business.owner_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(biz, field, value)
    await db.commit()
    await db.refresh(biz)
    return BusinessRead.model_validate(biz)


@router.post("/{business_id}/documents", response_model=BusinessDocumentRead, status_code=201)
async def upload_document(
    business_id: uuid.UUID,
    user: CurrentUser,
    db: DB,
    file: UploadFile = File(...),
) -> BusinessDocumentRead:
    biz = (
        await db.execute(
            select(Business).where(
                Business.id == business_id, Business.owner_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    data = await file.read()
    if len(data) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large")

    storage = get_storage()
    key = await storage.save(data, file.filename or "upload", file.content_type or "application/octet-stream")
    text = extract_text_from_bytes(data, file.content_type or "", file.filename or "")

    doc = BusinessDocument(
        business_id=biz.id,
        filename=file.filename or "upload",
        storage_path=key,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(data),
        extracted_text=text[:200_000] or None,
        indexed=False,
    )
    db.add(doc)
    await db.flush()

    if text:
        try:
            await get_rag_service().ingest_text(
                text,
                source=file.filename or "upload",
                metadata={"business_id": str(biz.id), "document_id": str(doc.id)},
            )
            doc.indexed = True
            doc.vector_collection = settings.VECTOR_COLLECTION
        except Exception as exc:  # noqa: BLE001
            logger.warning("rag_ingest_failed", error=str(exc))
    await db.commit()
    await db.refresh(doc)
    return BusinessDocumentRead.model_validate(doc)


@router.post("/analyze", response_model=BusinessAnalysisResponse)
async def analyze_business(
    payload: BusinessAnalysisRequest, user: CurrentUser, db: DB
) -> BusinessAnalysisResponse:
    biz = (
        await db.execute(
            select(Business).where(
                Business.id == payload.business_id, Business.owner_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    business_payload = BusinessRead.model_validate(biz).model_dump(mode="json")
    report_data = await run_business_analysis(
        business=business_payload,
        language=payload.language,
        focus_areas=payload.focus_areas,
        additional_context=payload.additional_context,
        report_type=payload.report_type,
    )

    report = AIReport(
        user_id=user.id,
        business_id=biz.id,
        report_type=payload.report_type,
        title=report_data.get("title", "AI Business Report"),
        summary=report_data.get("summary"),
        content=report_data.get("sections", {}),
        language=payload.language,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    return BusinessAnalysisResponse(
        report_id=report.id,
        report_type=report.report_type,
        title=report.title,
        summary=report.summary or "",
        content=report.content,
        pdf_url=report.pdf_url,
        created_at=report.created_at,
    )


@router.get("/{business_id}/reports", response_model=list[BusinessAnalysisResponse])
async def list_reports(
    business_id: uuid.UUID, user: CurrentUser, db: DB
) -> list[BusinessAnalysisResponse]:
    biz = (
        await db.execute(
            select(Business).where(
                Business.id == business_id, Business.owner_id == user.id
            )
        )
    ).scalar_one_or_none()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    rows = (
        await db.execute(
            select(AIReport)
            .where(AIReport.business_id == biz.id)
            .order_by(AIReport.created_at.desc())
        )
    ).scalars().all()
    return [
        BusinessAnalysisResponse(
            report_id=r.id,
            report_type=r.report_type,
            title=r.title,
            summary=r.summary or "",
            content=r.content,
            pdf_url=r.pdf_url,
            created_at=r.created_at,
        )
        for r in rows
    ]

"""Celery tasks for asynchronous work."""

from __future__ import annotations

import asyncio
from pathlib import Path

from app.core.logging import get_logger
from app.services.documents import extract_text
from app.services.rag import get_rag_service
from app.workers.celery_app import celery_app

logger = get_logger(__name__)


@celery_app.task(name="app.workers.tasks.ingest_document", bind=True, max_retries=3)
def ingest_document(self, *, file_path: str, source: str, metadata: dict) -> int:
    """Parse a document and index it into the vector store."""
    text = extract_text(file_path)
    if not text:
        return 0

    async def _run() -> int:
        return await get_rag_service().ingest_text(text, source=source, metadata=metadata)

    return asyncio.run(_run())


@celery_app.task(name="app.workers.tasks.send_email", bind=True, max_retries=3)
def send_email(self, *, to: str, subject: str, body: str) -> bool:
    """Stub for transactional email — wire to Brevo/Resend/Mailgun in production."""
    logger.info("email_queued", to=to, subject=subject, body_chars=len(body))
    return True


@celery_app.task(name="app.workers.tasks.generate_pdf_report", bind=True)
def generate_pdf_report(self, *, report_id: str, output_dir: str) -> str:
    """Stub PDF generation — fully implementable with reportlab."""
    output_path = Path(output_dir) / f"{report_id}.pdf"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(b"%PDF-1.4\n%placeholder\n")
    logger.info("pdf_generated", path=str(output_path))
    return str(output_path)

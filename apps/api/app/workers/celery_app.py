"""Celery application — long-running tasks (email, ingestion, reports)."""

from __future__ import annotations

from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "eastern_ai",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_default_queue="default",
    task_routes={
        "app.workers.tasks.ingest_document": {"queue": "rag"},
        "app.workers.tasks.send_email": {"queue": "email"},
        "app.workers.tasks.generate_pdf_report": {"queue": "reports"},
    },
)

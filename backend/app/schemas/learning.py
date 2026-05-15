"""Course / lesson schemas."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import CourseLevel, CourseStatus, Language, LessonType


class LessonRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    title: str
    order_index: int
    lesson_type: LessonType
    content_markdown: str | None = None
    video_url: str | None = None
    duration_minutes: int


class CourseSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    title: str
    subtitle: str | None = None
    cover_image: str | None = None
    category: str
    level: CourseLevel
    language: Language
    duration_minutes: int
    is_free: bool
    price_cents: int
    rating: float
    rating_count: int
    instructor_name: str | None = None


class CourseRead(CourseSummary):
    description: str
    status: CourseStatus
    learning_outcomes: list[str] = []
    prerequisites: list[str] = []
    tags: list[str] = []
    lessons: list[LessonRead] = []


class EnrollmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    course_id: uuid.UUID
    progress_percent: float
    completed_at: datetime | None = None
    notes: str | None = None
    created_at: datetime

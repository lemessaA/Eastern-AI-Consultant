"""Courses, lessons, enrollments, quizzes and certificates."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPKMixin
from app.models.enums import CourseLevel, CourseStatus, Language, LessonType

if TYPE_CHECKING:
    from app.models.user import User


class Course(Base, UUIDPKMixin, TimestampMixin):
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String(280), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    category: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    level: Mapped[CourseLevel] = mapped_column(
        Enum(CourseLevel, name="course_level"), default=CourseLevel.BEGINNER, nullable=False
    )
    status: Mapped[CourseStatus] = mapped_column(
        Enum(CourseStatus, name="course_status"), default=CourseStatus.DRAFT, nullable=False
    )
    language: Mapped[Language] = mapped_column(
        Enum(Language, name="course_language"), default=Language.EN, nullable=False
    )
    duration_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    price_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_free: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    rating_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    instructor_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    instructor_bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    learning_outcomes: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    prerequisites: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)

    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="course",
        cascade="all, delete-orphan",
        order_by="Lesson.order_index",
    )
    enrollments: Mapped[list["Enrollment"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )


class Lesson(Base, UUIDPKMixin, TimestampMixin):
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    slug: Mapped[str] = mapped_column(String(160), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    lesson_type: Mapped[LessonType] = mapped_column(
        Enum(LessonType, name="lesson_type"), default=LessonType.ARTICLE, nullable=False
    )
    content_markdown: Mapped[str | None] = mapped_column(Text, nullable=True)
    video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    resources: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)

    __table_args__ = (UniqueConstraint("course_id", "slug"),)

    course: Mapped[Course] = relationship(back_populates="lessons")
    progress_entries: Mapped[list["LessonProgress"]] = relationship(
        back_populates="lesson", cascade="all, delete-orphan"
    )
    quizzes: Mapped[list["Quiz"]] = relationship(
        back_populates="lesson", cascade="all, delete-orphan"
    )


class Enrollment(Base, UUIDPKMixin, TimestampMixin):
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    progress_percent: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (UniqueConstraint("user_id", "course_id"),)

    user: Mapped["User"] = relationship(back_populates="enrollments")
    course: Mapped[Course] = relationship(back_populates="enrollments")
    certificate: Mapped["Certificate | None"] = relationship(
        back_populates="enrollment", cascade="all, delete-orphan", uselist=False
    )


class LessonProgress(Base, UUIDPKMixin, TimestampMixin):
    __tablename__ = "lesson_progress"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    lesson_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    seconds_spent: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "lesson_id"),)

    lesson: Mapped[Lesson] = relationship(back_populates="progress_entries")


class Quiz(Base, UUIDPKMixin, TimestampMixin):
    __tablename__ = "quizzes"

    lesson_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    questions: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)
    pass_score: Mapped[int] = mapped_column(Integer, default=70, nullable=False)

    lesson: Mapped[Lesson] = relationship(back_populates="quizzes")
    attempts: Mapped[list["QuizAttempt"]] = relationship(
        back_populates="quiz", cascade="all, delete-orphan"
    )


class QuizAttempt(Base, UUIDPKMixin, TimestampMixin):
    __tablename__ = "quiz_attempts"

    quiz_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    answers: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)

    quiz: Mapped[Quiz] = relationship(back_populates="attempts")


class Certificate(Base, UUIDPKMixin, TimestampMixin):
    enrollment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("enrollments.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    code: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    pdf_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    enrollment: Mapped[Enrollment] = relationship(back_populates="certificate")

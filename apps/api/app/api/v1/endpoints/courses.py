"""Course catalogue + enrollment + progress endpoints."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, select

from app.core.deps import DB, CurrentUser
from app.models.enums import CourseLevel, CourseStatus, Language
from app.models.learning import Course, Enrollment, Lesson, LessonProgress
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.learning import CourseRead, CourseSummary, EnrollmentRead, LessonRead

router = APIRouter()


@router.get("", response_model=PaginatedResponse[CourseSummary])
async def list_courses(
    db: DB,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: str | None = None,
    level: CourseLevel | None = None,
    language: Language | None = None,
    free: bool | None = None,
    search: str | None = None,
) -> PaginatedResponse[CourseSummary]:
    stmt = select(Course).where(Course.status == CourseStatus.PUBLISHED)
    if category:
        stmt = stmt.where(Course.category == category)
    if level:
        stmt = stmt.where(Course.level == level)
    if language:
        stmt = stmt.where(Course.language == language)
    if free is not None:
        stmt = stmt.where(Course.is_free.is_(free))
    if search:
        like = f"%{search.lower()}%"
        stmt = stmt.where(func.lower(Course.title).like(like))

    total = (await db.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    rows = (
        await db.execute(
            stmt.order_by(Course.rating.desc(), Course.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
    ).scalars().all()
    return PaginatedResponse(
        items=[CourseSummary.model_validate(c) for c in rows],
        total=int(total),
        page=page,
        page_size=page_size,
    )


@router.get("/{slug}", response_model=CourseRead)
async def get_course(slug: str, db: DB) -> CourseRead:
    course = (
        await db.execute(select(Course).where(Course.slug == slug))
    ).scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    lessons = (
        await db.execute(
            select(Lesson)
            .where(Lesson.course_id == course.id)
            .order_by(Lesson.order_index)
        )
    ).scalars().all()
    out = CourseRead.model_validate(course)
    out.lessons = [LessonRead.model_validate(le) for le in lessons]
    return out


@router.post("/{slug}/enroll", response_model=EnrollmentRead)
async def enroll(slug: str, user: CurrentUser, db: DB) -> EnrollmentRead:
    course = (
        await db.execute(select(Course).where(Course.slug == slug))
    ).scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    existing = (
        await db.execute(
            select(Enrollment).where(
                Enrollment.user_id == user.id, Enrollment.course_id == course.id
            )
        )
    ).scalar_one_or_none()
    if existing:
        return EnrollmentRead.model_validate(existing)
    enrollment = Enrollment(user_id=user.id, course_id=course.id, progress_percent=0.0)
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return EnrollmentRead.model_validate(enrollment)


@router.get("/me/enrollments", response_model=list[EnrollmentRead])
async def my_enrollments(user: CurrentUser, db: DB) -> list[EnrollmentRead]:
    rows = (
        await db.execute(
            select(Enrollment)
            .where(Enrollment.user_id == user.id)
            .order_by(Enrollment.created_at.desc())
        )
    ).scalars().all()
    return [EnrollmentRead.model_validate(e) for e in rows]


@router.post("/lessons/{lesson_id}/complete", response_model=MessageResponse)
async def complete_lesson(
    lesson_id: uuid.UUID, user: CurrentUser, db: DB
) -> MessageResponse:
    lesson = (
        await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    ).scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    progress = (
        await db.execute(
            select(LessonProgress).where(
                LessonProgress.user_id == user.id, LessonProgress.lesson_id == lesson.id
            )
        )
    ).scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if progress is None:
        progress = LessonProgress(
            user_id=user.id,
            lesson_id=lesson.id,
            completed=True,
            completed_at=now,
        )
        db.add(progress)
    else:
        progress.completed = True
        progress.completed_at = now

    # Recompute course progress percent.
    all_lessons = (
        await db.execute(select(Lesson.id).where(Lesson.course_id == lesson.course_id))
    ).scalars().all()
    done_lessons = (
        await db.execute(
            select(func.count(LessonProgress.id))
            .where(
                LessonProgress.user_id == user.id,
                LessonProgress.completed.is_(True),
                LessonProgress.lesson_id.in_(all_lessons),
            )
        )
    ).scalar_one()
    pct = (int(done_lessons) / max(1, len(all_lessons))) * 100

    enrollment = (
        await db.execute(
            select(Enrollment).where(
                Enrollment.user_id == user.id, Enrollment.course_id == lesson.course_id
            )
        )
    ).scalar_one_or_none()
    if enrollment:
        enrollment.progress_percent = round(pct, 2)
        if pct >= 100 and not enrollment.completed_at:
            enrollment.completed_at = now

    await db.commit()
    return MessageResponse(message="Lesson marked complete.")

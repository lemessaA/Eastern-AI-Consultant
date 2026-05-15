"""Seed the database with realistic demo data.

Run with:

    docker compose exec api python -m scripts.seed
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.security import hash_password
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.models import Course, Lesson, User
from app.models.enums import (
    CourseLevel,
    CourseStatus,
    Language,
    LessonType,
    UserRole,
)


COURSES: list[dict] = [
    {
        "slug": "intro-to-ai",
        "title": "Introduction to AI",
        "subtitle": "Your first 90 minutes with Artificial Intelligence",
        "description": "A gentle, hands-on tour of what AI is, how it works, and how you can use it today — even with a basic smartphone.",
        "category": "AI Fundamentals",
        "level": CourseLevel.BEGINNER,
        "duration_minutes": 90,
        "tags": ["ai", "beginner", "fundamentals"],
        "instructor_name": "Eastern AI Faculty",
        "learning_outcomes": [
            "Explain what AI is and what it isn't",
            "Use ChatGPT and Claude effectively",
            "Spot AI hype vs. real value",
        ],
        "lessons": [
            ("welcome", "Welcome & how to learn", LessonType.ARTICLE, 8),
            ("what-is-ai", "What is AI, really?", LessonType.VIDEO, 14),
            ("history", "From rule-based to LLMs", LessonType.ARTICLE, 12),
            ("first-prompt", "Your first prompt", LessonType.INTERACTIVE, 15),
            ("limits", "Where AI fails (and why)", LessonType.ARTICLE, 11),
            ("quiz", "Quiz: AI basics", LessonType.QUIZ, 10),
        ],
    },
    {
        "slug": "prompt-engineering",
        "title": "Prompt Engineering Masterclass",
        "subtitle": "Get 10x better results from any AI model",
        "description": "Frameworks (CRISP, RTF, TREE) + 50 production prompts you can copy today.",
        "category": "Prompt Engineering",
        "level": CourseLevel.INTERMEDIATE,
        "duration_minutes": 180,
        "tags": ["prompts", "chatgpt", "claude"],
        "instructor_name": "Eastern AI Faculty",
        "learning_outcomes": [
            "Write structured prompts using CRISP",
            "Use few-shot, chain-of-thought, role prompting",
            "Build prompt libraries for your business",
        ],
        "lessons": [
            ("anatomy", "Anatomy of a great prompt", LessonType.VIDEO, 18),
            ("crisp", "The CRISP framework", LessonType.ARTICLE, 22),
            ("few-shot", "Few-shot and chain-of-thought", LessonType.ARTICLE, 25),
            ("personas", "Role + persona prompts", LessonType.ARTICLE, 18),
            ("library", "Build your prompt library", LessonType.INTERACTIVE, 30),
        ],
    },
    {
        "slug": "ai-for-business",
        "title": "AI for African Business Owners",
        "subtitle": "Practical AI you can ship in 7 days",
        "description": "End-to-end playbook: WhatsApp automation, AI customer service, content engines, dashboards.",
        "category": "AI for Business",
        "level": CourseLevel.BEGINNER,
        "duration_minutes": 240,
        "tags": ["business", "automation", "whatsapp"],
        "instructor_name": "Eastern AI Faculty",
        "learning_outcomes": [
            "Identify the top 5 AI wins for your business",
            "Set up a WhatsApp AI assistant",
            "Generate 30 days of content in 1 hour",
        ],
        "lessons": [
            ("intro", "AI = leverage for SMEs", LessonType.VIDEO, 12),
            ("audit", "Run an AI opportunity audit", LessonType.INTERACTIVE, 25),
            ("whatsapp", "WhatsApp AI assistant", LessonType.VIDEO, 30),
            ("content", "AI content engine", LessonType.ARTICLE, 28),
            ("dashboards", "AI dashboards in 1 hour", LessonType.VIDEO, 22),
        ],
    },
    {
        "slug": "ai-for-agriculture",
        "title": "AI for Agriculture",
        "subtitle": "Smart farming for smallholders in the Horn of Africa",
        "description": "Use AI for crop selection, pest detection, irrigation timing and market pricing.",
        "category": "AI for Agriculture",
        "level": CourseLevel.BEGINNER,
        "duration_minutes": 150,
        "tags": ["agriculture", "farming", "ethiopia"],
        "instructor_name": "Eastern AI Agronomy",
        "learning_outcomes": [
            "Use Plantix and AI for disease diagnosis",
            "Plan irrigation with forecast data",
            "Time selling to market peaks",
        ],
        "lessons": [
            ("primer", "Smart farming primer", LessonType.VIDEO, 16),
            ("plantix", "Plantix in the field", LessonType.VIDEO, 20),
            ("weather", "Weather + irrigation", LessonType.ARTICLE, 22),
            ("prices", "AI for market prices", LessonType.ARTICLE, 18),
        ],
    },
    {
        "slug": "ai-marketing",
        "title": "AI for Marketing",
        "subtitle": "Grow your brand in 30 days with AI",
        "description": "Channel strategy, AI copywriting, automated content calendars, ads, analytics.",
        "category": "AI for Marketing",
        "level": CourseLevel.INTERMEDIATE,
        "duration_minutes": 210,
        "tags": ["marketing", "social", "content"],
        "instructor_name": "Eastern AI Studio",
        "learning_outcomes": [
            "Build a brand voice guide with AI",
            "Generate 30-day content calendars",
            "Run Meta + TikTok ads on a budget",
        ],
        "lessons": [
            ("voice", "Brand voice in 30 minutes", LessonType.VIDEO, 18),
            ("calendar", "AI content calendar", LessonType.INTERACTIVE, 26),
            ("hooks", "Scroll-stopping hooks", LessonType.ARTICLE, 14),
            ("ads", "Meta + TikTok ads on a budget", LessonType.VIDEO, 35),
        ],
    },
    {
        "slug": "ai-automation",
        "title": "No-Code AI Automation",
        "subtitle": "Build agentic workflows with Make, Zapier and n8n",
        "description": "Step-by-step automations that save 10+ hours a week for SMEs.",
        "category": "AI Automation",
        "level": CourseLevel.INTERMEDIATE,
        "duration_minutes": 200,
        "tags": ["automation", "n8n", "zapier"],
        "instructor_name": "Eastern AI Workshop",
        "learning_outcomes": [
            "Build a WhatsApp → CRM automation",
            "Auto-publish to all socials",
            "Wire AI agents into your tools",
        ],
        "lessons": [
            ("foundations", "Automation foundations", LessonType.VIDEO, 16),
            ("whatsapp-crm", "WhatsApp → CRM", LessonType.VIDEO, 28),
            ("socials", "Auto-publish socials", LessonType.ARTICLE, 22),
            ("agents", "AI agents + tool use", LessonType.VIDEO, 32),
        ],
    },
    {
        "slug": "ai-ethics",
        "title": "AI Ethics for Africa",
        "subtitle": "Build AI you (and your customers) can trust",
        "description": "Privacy, bias, language equity, sovereignty — the ethics every African builder should know.",
        "category": "AI Ethics",
        "level": CourseLevel.BEGINNER,
        "duration_minutes": 120,
        "tags": ["ethics", "trust", "policy"],
        "instructor_name": "Eastern AI Policy",
        "learning_outcomes": [
            "Apply the AU AI principles",
            "Audit data sources for bias",
            "Design for low-bandwidth equity",
        ],
        "lessons": [
            ("principles", "The AU AI principles", LessonType.ARTICLE, 18),
            ("bias", "Spotting and fixing bias", LessonType.VIDEO, 22),
            ("language", "Language equity", LessonType.ARTICLE, 16),
        ],
    },
    {
        "slug": "ai-productivity",
        "title": "AI Productivity Tools",
        "subtitle": "Get 4 hours back every day",
        "description": "Stacks of AI tools for writing, research, design and project management.",
        "category": "AI Productivity",
        "level": CourseLevel.BEGINNER,
        "duration_minutes": 130,
        "tags": ["productivity", "tools", "stack"],
        "instructor_name": "Eastern AI Studio",
        "learning_outcomes": [
            "Build your personal AI stack",
            "Master AI-powered note-taking",
            "Run AI-driven planning rituals",
        ],
        "lessons": [
            ("stack", "Build your AI stack", LessonType.VIDEO, 18),
            ("notes", "AI note-taking", LessonType.ARTICLE, 14),
            ("planning", "AI planning rituals", LessonType.INTERACTIVE, 22),
        ],
    },
]


async def _ensure_admin(db) -> None:
    existing = (await db.execute(select(User).where(User.email == "admin@eastern.ai"))).scalar_one_or_none()
    if existing:
        return
    admin = User(
        email="admin@eastern.ai",
        hashed_password=hash_password("admin12345"),
        full_name="Eastern AI Admin",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True,
        is_superuser=True,
        preferred_language=Language.EN,
        country="Ethiopia",
    )
    db.add(admin)
    print("✔ Created admin@eastern.ai / admin12345")


async def _seed_courses(db) -> None:
    for c in COURSES:
        existing = (await db.execute(select(Course).where(Course.slug == c["slug"]))).scalar_one_or_none()
        if existing:
            continue
        course = Course(
            slug=c["slug"],
            title=c["title"],
            subtitle=c["subtitle"],
            description=c["description"],
            category=c["category"],
            level=c["level"],
            status=CourseStatus.PUBLISHED,
            language=Language.EN,
            duration_minutes=c["duration_minutes"],
            is_free=True,
            price_cents=0,
            tags=c["tags"],
            instructor_name=c["instructor_name"],
            learning_outcomes=c["learning_outcomes"],
            rating=4.7,
            rating_count=124,
            cover_image=f"https://images.unsplash.com/photo-{(hash(c['slug']) % 10) + 1700000000000}",
        )
        db.add(course)
        await db.flush()

        for idx, (slug, title, ltype, mins) in enumerate(c["lessons"]):
            db.add(
                Lesson(
                    course_id=course.id,
                    slug=slug,
                    title=title,
                    order_index=idx,
                    lesson_type=ltype,
                    duration_minutes=mins,
                    content_markdown=(
                        f"## {title}\n\nThis lesson is auto-seeded. Replace with real content.\n"
                    ),
                )
            )
        print(f"✔ Seeded course: {c['title']} ({len(c['lessons'])} lessons)")


async def run() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        await _ensure_admin(db)
        await _seed_courses(db)
        await db.commit()
    print(f"\nDone at {datetime.now(timezone.utc).isoformat()}")


if __name__ == "__main__":
    asyncio.run(run())

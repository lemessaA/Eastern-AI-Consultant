"""Shared enumerations used by ORM models and Pydantic schemas."""

from __future__ import annotations

import enum


class UserRole(str, enum.Enum):
    STUDENT = "student"
    BUSINESS_OWNER = "business_owner"
    TEACHER = "teacher"
    CONSULTANT = "consultant"
    ADMIN = "admin"


class Language(str, enum.Enum):
    EN = "en"
    AM = "am"  # Amharic
    OM = "om"  # Afaan Oromo
    SO = "so"  # Somali


class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    TRIALING = "trialing"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    EXPIRED = "expired"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"


class CourseLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class CourseStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class LessonType(str, enum.Enum):
    VIDEO = "video"
    ARTICLE = "article"
    QUIZ = "quiz"
    INTERACTIVE = "interactive"
    DOWNLOAD = "download"


class AgentType(str, enum.Enum):
    TEACHER = "teacher"
    BUSINESS_CONSULTANT = "business_consultant"
    AGRICULTURE = "agriculture"
    MARKETING = "marketing"
    CAREER_COACH = "career_coach"
    AUTOMATION = "automation"
    RESUME_BUILDER = "resume_builder"
    TRANSLATOR = "translator"
    STUDENT_TUTOR = "student_tutor"
    STARTUP_ADVISOR = "startup_advisor"


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"


class AutomationType(str, enum.Enum):
    WHATSAPP = "whatsapp"
    EMAIL = "email"
    INVOICE = "invoice"
    SOCIAL = "social"
    CHATBOT = "chatbot"
    APPOINTMENT = "appointment"
    LEAD = "lead"
    CRM = "crm"


class AutomationStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    FAILED = "failed"


class ReportType(str, enum.Enum):
    SWOT = "swot"
    BUSINESS_ANALYSIS = "business_analysis"
    MARKETING_STRATEGY = "marketing_strategy"
    AUTOMATION_ROADMAP = "automation_roadmap"
    AGRICULTURE_PLAN = "agriculture_plan"
    CAREER_PLAN = "career_plan"


class NotificationChannel(str, enum.Enum):
    IN_APP = "in_app"
    EMAIL = "email"
    PUSH = "push"

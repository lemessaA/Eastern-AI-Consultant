"""SQLAlchemy ORM models for Eastern AI Consultant.

Importing this module ensures every model is registered with the declarative
base, which is required by Alembic and ``create_all``.
"""

from app.models.ai import AIReport, Automation, AutomationRun
from app.models.business import Business, BusinessDocument
from app.models.chat import Conversation, Message
from app.models.community import Comment, ForumPost, Reaction
from app.models.learning import (
    Certificate,
    Course,
    Enrollment,
    Lesson,
    LessonProgress,
    Quiz,
    QuizAttempt,
)
from app.models.notification import Notification
from app.models.payment import Payment, Subscription
from app.models.user import OAuthAccount, User, UserSession

__all__ = [
    "AIReport",
    "Automation",
    "AutomationRun",
    "Business",
    "BusinessDocument",
    "Certificate",
    "Comment",
    "Conversation",
    "Course",
    "Enrollment",
    "ForumPost",
    "Lesson",
    "LessonProgress",
    "Message",
    "Notification",
    "OAuthAccount",
    "Payment",
    "Quiz",
    "QuizAttempt",
    "Reaction",
    "Subscription",
    "User",
    "UserSession",
]

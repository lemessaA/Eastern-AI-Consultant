"""Pydantic v2 schemas used for request validation and response serialisation."""

from app.schemas.auth import (
    GoogleAuthRequest,
    LoginRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)
from app.schemas.business import (
    BusinessAnalysisRequest,
    BusinessAnalysisResponse,
    BusinessCreate,
    BusinessDocumentRead,
    BusinessRead,
    BusinessUpdate,
)
from app.schemas.chat import (
    ChatStreamRequest,
    ConversationCreate,
    ConversationDetailRead,
    ConversationRead,
    MessageRead,
)
from app.schemas.common import HealthResponse, MessageResponse, PaginatedResponse
from app.schemas.community import (
    CommentCreate,
    CommentRead,
    ForumPostCreate,
    ForumPostRead,
)
from app.schemas.learning import (
    CourseRead,
    CourseSummary,
    EnrollmentRead,
    LessonRead,
)
from app.schemas.user import UserPublic, UserRead, UserUpdate

__all__ = [
    "BusinessAnalysisRequest",
    "BusinessAnalysisResponse",
    "BusinessCreate",
    "BusinessDocumentRead",
    "BusinessRead",
    "BusinessUpdate",
    "ChatStreamRequest",
    "CommentCreate",
    "CommentRead",
    "ConversationCreate",
    "ConversationDetailRead",
    "ConversationRead",
    "CourseRead",
    "CourseSummary",
    "EnrollmentRead",
    "ForumPostCreate",
    "ForumPostRead",
    "GoogleAuthRequest",
    "HealthResponse",
    "LessonRead",
    "LoginRequest",
    "MessageRead",
    "MessageResponse",
    "PaginatedResponse",
    "PasswordResetConfirm",
    "PasswordResetRequest",
    "RefreshRequest",
    "RegisterRequest",
    "TokenResponse",
    "UserPublic",
    "UserRead",
    "UserUpdate",
]

"""Authentication endpoints: register, login, refresh, password reset, Google."""

from __future__ import annotations

import hashlib
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.core.config import settings
from app.core.deps import DB, CurrentUser
from app.core.logging import get_logger
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_url_safe_token,
    hash_password,
    verify_password,
)
from app.models.enums import UserRole
from app.models.user import OAuthAccount, User, UserSession
from app.schemas.auth import (
    GoogleAuthRequest,
    LoginRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)
from app.schemas.common import MessageResponse
from app.schemas.user import UserRead

router = APIRouter()
logger = get_logger(__name__)


def _hash_refresh(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


async def _build_token_response(user: User, db) -> TokenResponse:
    access = create_access_token(
        user.id, extra={"role": user.role.value, "email": user.email}
    )
    refresh = create_refresh_token(user.id)
    session = UserSession(
        user_id=user.id,
        refresh_token_hash=_hash_refresh(refresh),
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(session)
    user.last_login_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(user)
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserRead.model_validate(user),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: DB) -> TokenResponse:
    existing = (
        await db.execute(select(User).where(User.email == payload.email.lower()))
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="An account with that email already exists.")

    role = UserRole.STUDENT
    if payload.role:
        try:
            role = UserRole(payload.role)
        except ValueError:
            role = UserRole.STUDENT

    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name.strip(),
        preferred_language=payload.preferred_language,
        country=payload.country,
        role=role,
        is_active=True,
        is_verified=False,
        email_verification_token=generate_url_safe_token(),
    )
    db.add(user)
    await db.flush()
    return await _build_token_response(user, db)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: DB) -> TokenResponse:
    user = (
        await db.execute(select(User).where(User.email == payload.email.lower()))
    ).scalar_one_or_none()
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled.")
    return await _build_token_response(user, db)


@router.post("/login/form", response_model=TokenResponse, include_in_schema=False)
async def login_form(
    db: DB,
    form: OAuth2PasswordRequestForm = Depends(),
) -> TokenResponse:
    """OAuth2 form-data login used by Swagger UI's 'Authorize'."""
    return await login(LoginRequest(email=form.username, password=form.password), db)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest, db: DB) -> TokenResponse:
    try:
        data = decode_token(payload.refresh_token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid refresh token") from exc

    if data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Wrong token type")

    user_id = data.get("sub")
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")
    # NOTE: rotation — invalidate previous sessions matching this refresh hash
    token_hash = _hash_refresh(payload.refresh_token)
    existing = (
        await db.execute(
            select(UserSession).where(UserSession.refresh_token_hash == token_hash)
        )
    ).scalar_one_or_none()
    if existing and existing.revoked_at is None:
        existing.revoked_at = datetime.now(timezone.utc)
    await db.flush()
    return await _build_token_response(user, db)


@router.post("/logout", response_model=MessageResponse)
async def logout(user: CurrentUser, db: DB) -> MessageResponse:
    now = datetime.now(timezone.utc)
    sessions = (
        await db.execute(
            select(UserSession).where(
                UserSession.user_id == user.id, UserSession.revoked_at.is_(None)
            )
        )
    ).scalars().all()
    for s in sessions:
        s.revoked_at = now
    await db.commit()
    return MessageResponse(message="Logged out of all sessions.")


@router.get("/me", response_model=UserRead)
async def me(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)


@router.post("/password/forgot", response_model=MessageResponse)
async def forgot_password(payload: PasswordResetRequest, db: DB) -> MessageResponse:
    user = (
        await db.execute(select(User).where(User.email == payload.email.lower()))
    ).scalar_one_or_none()
    if user:
        user.password_reset_token = generate_url_safe_token()
        user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        await db.commit()
        # TODO: enqueue email send via Celery worker.
        logger.info("password_reset_issued", email=user.email)
    return MessageResponse(message="If that email exists, a reset link has been sent.")


@router.post("/password/reset", response_model=MessageResponse)
async def reset_password(payload: PasswordResetConfirm, db: DB) -> MessageResponse:
    user = (
        await db.execute(select(User).where(User.password_reset_token == payload.token))
    ).scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if (
        not user
        or not user.password_reset_expires
        or user.password_reset_expires < now
    ):
        raise HTTPException(status_code=400, detail="Token invalid or expired.")
    user.hashed_password = hash_password(payload.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    await db.commit()
    return MessageResponse(message="Password updated successfully.")


@router.post("/verify-email/{token}", response_model=MessageResponse)
async def verify_email(token: str, db: DB) -> MessageResponse:
    user = (
        await db.execute(select(User).where(User.email_verification_token == token))
    ).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token.")
    user.is_verified = True
    user.email_verification_token = None
    await db.commit()
    return MessageResponse(message="Email verified.")


def _google_email_verified(data: dict) -> bool:
    value = data.get("email_verified")
    return value is True or str(value).lower() == "true"


async def _verify_google_id_token(id_token: str) -> dict:
    """Validate a Google ID token (GIS / One Tap credential JWT)."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": id_token},
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token.")
    data = resp.json()
    if settings.GOOGLE_CLIENT_ID and data.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Google audience mismatch.")
    if not _google_email_verified(data):
        raise HTTPException(status_code=401, detail="Google email is not verified.")
    return data


async def _ensure_google_oauth_link(db, user: User, google_sub: str) -> None:
    """Attach a Google OAuth row when an existing email/password user signs in with Google."""
    if not google_sub:
        return
    linked = (
        await db.execute(
            select(OAuthAccount).where(
                OAuthAccount.user_id == user.id,
                OAuthAccount.provider == "google",
            )
        )
    ).scalar_one_or_none()
    if linked is None:
        db.add(
            OAuthAccount(
                user_id=user.id,
                provider="google",
                provider_account_id=google_sub,
            )
        )
    elif linked.provider_account_id != google_sub:
        raise HTTPException(
            status_code=409,
            detail="This email is linked to a different Google account.",
        )


@router.get("/google/status")
async def google_auth_status() -> dict[str, bool]:
    """Whether the API is configured to validate Google ID tokens."""
    return {"enabled": bool(settings.GOOGLE_CLIENT_ID)}


@router.post("/google", response_model=TokenResponse)
async def google_auth(payload: GoogleAuthRequest, db: DB) -> TokenResponse:
    """Verify a Google ID token and sign the user in (creating them if needed)."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=503,
            detail="Google sign-in is not configured on the server (GOOGLE_CLIENT_ID).",
        )

    data = await _verify_google_id_token(payload.id_token)
    email = (data.get("email") or "").lower()
    if not email:
        raise HTTPException(status_code=400, detail="Google token missing email.")

    google_sub = data.get("sub") or ""
    user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()

    if not user:
        user = User(
            email=email,
            full_name=data.get("name") or email.split("@")[0],
            avatar_url=data.get("picture"),
            is_active=True,
            is_verified=True,
            preferred_language=payload.preferred_language,
            role=UserRole.STUDENT,
        )
        db.add(user)
        await db.flush()
        db.add(
            OAuthAccount(
                user_id=user.id,
                provider="google",
                provider_account_id=google_sub,
            )
        )
    else:
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account disabled.")
        await _ensure_google_oauth_link(db, user, google_sub)
        if data.get("picture") and not user.avatar_url:
            user.avatar_url = data.get("picture")
        if data.get("name") and user.full_name == email.split("@")[0]:
            user.full_name = data.get("name") or user.full_name
        user.is_verified = True
        if payload.preferred_language:
            user.preferred_language = payload.preferred_language

    await db.flush()
    return await _build_token_response(user, db)

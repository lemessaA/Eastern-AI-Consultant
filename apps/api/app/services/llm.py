"""LLM provider abstraction.

The platform standardises on Groq (Llama 3.x family) for low-latency streaming
inference, with optional OpenAI fallback. This module centralises model
configuration so every agent shares the same chat model factory.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from langchain_core.language_models import BaseChatModel
from langchain_groq import ChatGroq

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


ModelTier = Literal["fast", "balanced", "deep"]

_MODEL_MAP: dict[ModelTier, str] = {
    "fast": settings.GROQ_FAST_MODEL,
    "balanced": settings.GROQ_MODEL,
    "deep": settings.GROQ_MODEL,
}


@lru_cache(maxsize=8)
def get_chat_model(
    tier: ModelTier = "balanced",
    temperature: float = 0.4,
    streaming: bool = True,
) -> BaseChatModel:
    """Return a cached LangChain chat model instance for a given tier."""

    if not settings.GROQ_API_KEY:
        logger.warning("groq_api_key_missing", message="GROQ_API_KEY is not configured")

    model_name = _MODEL_MAP[tier]
    return ChatGroq(
        api_key=settings.GROQ_API_KEY or "missing",
        model=model_name,
        temperature=temperature,
        streaming=streaming,
        max_tokens=4096,
        timeout=60,
        max_retries=2,
    )

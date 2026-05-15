"""Generic response shapes used across the API."""

from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str
    environment: str


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int = Field(ge=1, default=1)
    page_size: int = Field(ge=1, le=200, default=20)

    @property
    def pages(self) -> int:
        if self.page_size == 0:
            return 0
        return (self.total + self.page_size - 1) // self.page_size

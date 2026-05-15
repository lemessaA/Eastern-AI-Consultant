"""Pluggable file storage (local / S3 / Cloudinary)."""

from __future__ import annotations

import uuid
from pathlib import Path
from typing import Protocol

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class StorageBackend(Protocol):
    async def save(self, data: bytes, filename: str, content_type: str) -> str: ...
    async def url_for(self, key: str) -> str: ...


class LocalStorage:
    def __init__(self, base_dir: str | Path) -> None:
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        key = f"{uuid.uuid4().hex}_{Path(filename).name}"
        path = self.base_dir / key
        path.write_bytes(data)
        return str(path.relative_to(self.base_dir))

    async def url_for(self, key: str) -> str:
        return f"/uploads/{key}"


class S3Storage:
    def __init__(self) -> None:
        import boto3  # local import — only when used

        self.client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        self.bucket = settings.AWS_S3_BUCKET

    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        key = f"{uuid.uuid4().hex}_{Path(filename).name}"
        self.client.put_object(
            Bucket=self.bucket, Key=key, Body=data, ContentType=content_type
        )
        return key

    async def url_for(self, key: str) -> str:
        return self.client.generate_presigned_url(
            "get_object", Params={"Bucket": self.bucket, "Key": key}, ExpiresIn=3600
        )


def get_storage() -> StorageBackend:
    if settings.STORAGE_BACKEND == "s3" and settings.AWS_S3_BUCKET:
        return S3Storage()
    return LocalStorage(settings.UPLOAD_DIR)

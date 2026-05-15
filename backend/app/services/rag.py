"""Retrieval-Augmented Generation pipeline backed by ChromaDB.

Documents (PDF / DOCX / TXT / CSV) are parsed → split → embedded → stored.
The :class:`RAGService` exposes high-level helpers used by both the chat
endpoint and the business analysis workflow.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass(slots=True)
class RetrievedChunk:
    content: str
    score: float
    metadata: dict[str, Any]


class RAGService:
    """Thin wrapper around a persistent Chroma vector store."""

    def __init__(self) -> None:
        self._embeddings: HuggingFaceEmbeddings | None = None
        self._store: Chroma | None = None
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=120,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    # ------- Lazy initialisation -----------------------------------------
    @property
    def embeddings(self) -> HuggingFaceEmbeddings:
        if self._embeddings is None:
            self._embeddings = HuggingFaceEmbeddings(
                model_name=settings.EMBEDDING_MODEL,
                model_kwargs={"device": "cpu"},
                encode_kwargs={"normalize_embeddings": True},
            )
        return self._embeddings

    @property
    def store(self) -> Chroma:
        if self._store is None:
            Path(settings.VECTOR_STORE_PATH).mkdir(parents=True, exist_ok=True)
            self._store = Chroma(
                collection_name=settings.VECTOR_COLLECTION,
                persist_directory=settings.VECTOR_STORE_PATH,
                embedding_function=self.embeddings,
            )
        return self._store

    # ------- Public API --------------------------------------------------
    async def ingest_text(
        self,
        text: str,
        source: str,
        metadata: dict[str, Any] | None = None,
    ) -> int:
        """Split ``text`` into chunks, embed them and persist. Returns chunk count."""
        if not text.strip():
            return 0
        metadata = {**(metadata or {}), "source": source}
        chunks = self._splitter.split_text(text)
        docs = [Document(page_content=c, metadata={**metadata, "chunk": i}) for i, c in enumerate(chunks)]
        self.store.add_documents(docs)
        logger.info("rag_ingested", source=source, chunks=len(chunks))
        return len(chunks)

    async def query(
        self,
        question: str,
        k: int = 4,
        filter: dict[str, Any] | None = None,
    ) -> list[RetrievedChunk]:
        """Return the top-k most relevant chunks for ``question``."""
        try:
            results = self.store.similarity_search_with_relevance_scores(
                question, k=k, filter=filter
            )
        except Exception as exc:
            logger.warning("rag_query_failed", error=str(exc))
            return []
        return [
            RetrievedChunk(content=doc.page_content, score=float(score), metadata=doc.metadata)
            for doc, score in results
        ]

    async def query_as_context(self, question: str, k: int = 4) -> str:
        """Return retrieved chunks as a single prompt-ready string."""
        chunks = await self.query(question, k=k)
        if not chunks:
            return ""
        blocks = [
            f"[Source: {c.metadata.get('source', 'doc')}] {c.content.strip()}"
            for c in chunks
        ]
        return "\n\n---\n\n".join(blocks)


_rag_service: RAGService | None = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service

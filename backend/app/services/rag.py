"""Retrieval-Augmented Generation pipeline backed by ChromaDB.

Documents (PDF / DOCX / TXT / CSV) are parsed → split → embedded → stored.
The :class:`RAGService` exposes high-level helpers used by both the chat
endpoint and the business analysis workflow.

Embedding backend selection (lightest first):

1. **OpenAI** ``text-embedding-3-small`` — used automatically when
   ``OPENAI_API_KEY`` is set. No local model download, ~$0.02 / 1M tokens.
2. **ChromaDB default ONNX** — bundled with ``chromadb`` (~80 MB).
   Activates if no key is set and ``sentence-transformers`` is not installed.
3. **HuggingFace local** — only if you installed the ``local-embed`` extra
   (``uv sync --extra local-embed``). Best quality but pulls ~2 GB of PyTorch.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass(slots=True)
class RetrievedChunk:
    content: str
    score: float
    metadata: dict[str, Any]


def _build_embeddings() -> Embeddings | None:
    """Pick the best available embedding backend at startup."""

    # 1. OpenAI — cheapest, no local install.
    if settings.OPENAI_API_KEY:
        try:
            from langchain_openai import OpenAIEmbeddings

            logger.info("rag_embeddings_backend", backend="openai")
            return OpenAIEmbeddings(
                model="text-embedding-3-small",
                api_key=settings.OPENAI_API_KEY,
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning("openai_embeddings_failed", error=str(exc))

    # 2. Local HuggingFace via sentence-transformers (optional extra).
    try:
        from langchain_community.embeddings import HuggingFaceEmbeddings

        logger.info("rag_embeddings_backend", backend="huggingface")
        return HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
    except ImportError:
        # 3. Fall back to Chroma's bundled ONNX default — no extra install.
        logger.info(
            "rag_embeddings_backend",
            backend="chroma-default",
            note="Install `[local-embed]` extra or set OPENAI_API_KEY for better quality.",
        )
        return None


class RAGService:
    """Thin wrapper around a persistent Chroma vector store."""

    def __init__(self) -> None:
        self._embeddings: Embeddings | None | bool = False  # tri-state: unset
        self._store: Chroma | None = None
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=120,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    # ------- Lazy initialisation -----------------------------------------
    @property
    def embeddings(self) -> Embeddings | None:
        if self._embeddings is False:
            self._embeddings = _build_embeddings()
        return self._embeddings  # type: ignore[return-value]

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

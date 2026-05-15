# Eastern AI Consultant — API

FastAPI backend powering the Eastern AI Consultant platform. Multi-agent AI via
LangChain + LangGraph + Groq, async SQLAlchemy on Postgres (pgvector), Redis
caching and Celery workers, and a RAG pipeline backed by ChromaDB.

## Quickstart (local Python)

```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then set GROQ_API_KEY etc.
uvicorn app.main:app --reload --port 8000
```

API docs are at <http://localhost:8000/docs>.

## Database

```bash
# Apply schema (dev — for production use Alembic)
python -m scripts.seed

# Generate an Alembic migration after model changes
alembic revision --autogenerate -m "your message"
alembic upgrade head
```

## Architecture

```
app/
├── core/        # config, logging, security, deps
├── db/          # SQLAlchemy base + session
├── models/      # ORM models (users, courses, businesses, …)
├── schemas/     # Pydantic v2 schemas
├── api/v1/      # versioned REST endpoints
├── agents/      # 10 domain-specialist AI agents
├── langgraph/   # multi-agent workflows
├── services/    # llm, rag, documents, storage
└── workers/     # Celery tasks
```

## Default admin (after seeding)

- `admin@eastern.ai` / `admin12345`

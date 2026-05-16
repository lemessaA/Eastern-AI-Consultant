# Eastern AI Consultant

> **Learn AI. Automate Business. Build the Future.**
>
> A production-ready, multilingual AI platform built specifically for Eastern
> Ethiopia and Africa — combining an AI assistant, learning academy, business
> consulting, automation tools, and community into one mobile-first ecosystem.

[![Made for Africa](https://img.shields.io/badge/Made_for-Africa-3D9970)]()
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20AM%20%7C%20OM%20%7C%20SO-7C3AED)]()
[![Stack](https://img.shields.io/badge/Stack-Next.js_15%20%2F%20FastAPI%20%2F%20LangGraph-3955EB)]()

---

## ✨ What's inside

```
Eastern-AI-Consultant/
├── backend/                # FastAPI + LangChain + LangGraph + Groq + Celery
│   ├── app/                #   ├ core / db / models / schemas / agents
│   ├── alembic/            #   ├ migrations
│   ├── scripts/            #   ├ seed + ops scripts
│   ├── pyproject.toml      #   └ all Python deps
│   └── Dockerfile
├── frontend/               # Next.js 15 (App Router) + TS + Tailwind + Shadcn
│   ├── src/                #   ├ app / components / lib / hooks / store
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── infra/
│   └── nginx/              # Reverse proxy config (production)
├── docker-compose.yml      # Postgres (pgvector) · Redis · API · Worker · Web · Nginx
├── .env.example
└── README.md
```

### Core capabilities

| Module                    | Highlights                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| 🤖 **Multi-agent AI**     | 10 specialised agents (Teacher, Business, Agriculture, Marketing, Career, Automation, Resume, Translator…) |
| 🔀 **LangGraph workflows** | Auto-routing classifier + multi-step Business Analysis workflow (Diagnose → SWOT → Automation → Marketing) |
| 📚 **AI Academy**         | Courses, lessons, quizzes, certificates, progress tracking                                                |
| 🏢 **Business AI**        | Document upload → RAG knowledge base → full AI Business Report                                            |
| ⚙️ **Automation Center**  | WhatsApp, email, invoices, social, chatbot, lead capture templates                                       |
| 🌾 **Agriculture AI**     | Crop advice, pest diagnosis, weather, market prices                                                       |
| 💼 **Career Coach**       | ATS resumes, cover letters, interview sims, skill roadmaps                                                |
| 🛠 **AI Tool Directory**   | Curated catalogue of 12+ AI tools with pricing & ratings                                                  |
| 💬 **Community**          | Forum, comments, reactions                                                                                |
| 🌍 **i18n**               | English · Amharic · Afaan Oromo · Af-Soomaali                                                             |
| 🛡 **Auth**                | JWT + refresh tokens + Google OAuth, role-based access (5 roles)                                          |
| 📈 **Admin**              | Live analytics, charts, user/course/role moderation                                                       |
| 💳 **Subscriptions**      | Stripe-ready Free / Pro / Enterprise plans                                                                |
| 📱 **PWA**                | Mobile-first, installable, optimised for low bandwidth                                                    |

---

## 🚀 Quickstart with Docker (recommended)

```bash
cp .env.example .env
# add your GROQ_API_KEY at minimum

docker compose up --build
```

The first start will:

1. Pull `pgvector/pgvector:pg16` (Postgres + pgvector) and Redis.
2. Build the FastAPI container.
3. Build the Next.js container.
4. Boot Nginx in front of both.

Then:

- **Web:** <http://localhost:3000>
- **API + Swagger docs:** <http://localhost:8000/docs>
- **Nginx (web + api):** <http://localhost>

To load seed data (admin user + 8 demo courses):

```bash
docker compose exec api python -m scripts.seed
# Login as admin@eastern.ai / admin12345
```

---

## 🧑‍💻 Local development (without Docker)

### Backend (Python 3.12+)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"               # installs from pyproject.toml
cp .env.example .env                  # set GROQ_API_KEY, DATABASE_URL, etc.
uvicorn app.main:app --reload --port 8000
# In another terminal — seed:
python -m scripts.seed
```

### Frontend (Node 20+)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

---

## ☁️ Vercel (two projects)

Deploy the frontend and API as **separate Vercel projects** from this repo (`Root Directory`: `frontend` or `backend`). See **[docs/vercel.md](docs/vercel.md)** for environment variables, CORS wiring, and serverless limits.

---

## 🔑 Environment variables (highlights)

| Variable                          | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `GROQ_API_KEY`                    | **Required.** Powers all AI agents (Llama 3.x).    |
| `OPENAI_API_KEY`                  | Optional fallback / embeddings.                    |
| `DATABASE_URL`                    | `postgresql+asyncpg://…` async DSN.                |
| `SYNC_DATABASE_URL`               | `postgresql+psycopg2://…` for Alembic.             |
| `REDIS_URL`                       | Cache + Celery broker.                             |
| `JWT_SECRET` / `SECRET_KEY`       | 64-char random strings.                            |
| `GOOGLE_CLIENT_ID`/`SECRET`       | Google OAuth.                                      |
| `CORS_ORIGINS`                    | Comma-separated list.                              |
| `NEXT_PUBLIC_API_URL`             | Frontend → backend URL.                            |
| `STORAGE_BACKEND`                 | `local`, `s3`, or `cloudinary`.                    |

See `.env.example` for the full list.

---

## 🧠 AI architecture

```text
┌────────────────────────────────────────────────────────────────┐
│ Next.js (frontend/)                                            │
│   POST /api/v1/chat/stream  ──── SSE ─────►  user sees tokens  │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ FastAPI chat endpoint                                          │
│   1. classify_agent()         (LangGraph fast classifier)       │
│   2. agent.stream()           (specialist persona)              │
│   3. RAG context (optional)   (Chroma + sentence-transformers)  │
│   4. persist messages         (Postgres)                        │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────┴──────────────────┐
        │           Groq Cloud LLM            │
        │  Llama-3.3-70B-versatile (default)  │
        │  Llama-3.1-8B-instant   (classifier)│
        └─────────────────────────────────────┘
```

### Business Analysis workflow (LangGraph)

```
Business profile → diagnose → swot → automation_plan → marketing_plan → synthesize
                       ↓        ↓           ↓                ↓
            Business Consultant  ―   Automation Agent   Marketing Agent
```

---

## 🧪 Testing

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm run typecheck && npm run lint
```

---

## 📦 Deploying to production

- **Vercel** for `frontend/` — set `NEXT_PUBLIC_API_URL` to your backend URL.
- **Railway / Fly / AWS ECS** for `backend/` (FastAPI + Celery + Postgres + Redis).
- **Cloudflare / Fastly** in front for CDN + low-bandwidth optimisation.

The shipped `docker-compose.yml` is production-ready: healthchecks on every
service, volumes for Postgres / Redis / uploads / Chroma, and Nginx in front.

---

## 🤝 Default admin

After `python -m scripts.seed`:

- **Email:** `admin@eastern.ai`
- **Password:** `admin12345`
- **Role:** `admin` (superuser)

⚠️ **Rotate this immediately in production.**

---

## 🌍 Language support

| Code | Language     | Native       |
| ---- | ------------ | ------------ |
| `en` | English      | English      |
| `am` | Amharic      | አማርኛ         |
| `om` | Afaan Oromo  | Afaan Oromoo |
| `so` | Somali       | Af-Soomaali  |

Both the UI **and** AI responses are localised. Add a new language by extending
`frontend/src/lib/i18n/translations.ts` and `backend/app/agents/base.py`.

---

## 📜 License

Proprietary — © Eastern AI Consultant. All rights reserved.

---

## 🙏 Credits

- **Groq** — sub-second LLM inference for African networks.
- **LangChain & LangGraph** — agent orchestration.
- **shadcn/ui + Radix** — accessible UI primitives.
- The communities of Eastern Ethiopia, Somalia and the wider Horn of Africa,
  for inspiring the entire mission.

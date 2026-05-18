# Eastern AI Consultant — Software Requirements Specification (SRS)

**Document type:** Software Requirements Specification (IEEE-style outline)  
**Version:** 1.0  
**Status:** Baseline aligned to current repository implementation  
**Related:** [SSD.md](./SSD.md) (solution design / as-built architecture), [vercel.md](./vercel.md), [render-vercel.md](./render-vercel.md)

---

## 1. Introduction

### 1.1 Purpose

This SRS defines the **functional** and **non-functional** requirements for the **Eastern AI Consultant** web platform: a multilingual product combining AI-assisted chat, learning, business tools, agriculture and career helpers, community, subscriptions, and administration.

### 1.2 Scope

The system comprises:

- A **browser client** (Next.js 15, App Router).
- A **REST + streaming API** (FastAPI, versioned under `/api/v1`).
- **PostgreSQL** for durable data, **Redis** for Celery broker/cache patterns, **ChromaDB** (file-backed) for optional RAG.
- **External LLM** services (primary: Groq; optional: OpenAI embeddings).

Out of scope for a *complete* production launch without additional work: production-grade transactional email, full Stripe webhook lifecycle, downloadable PDF reports beyond stubs, and Celery execution on pure serverless hosts without a worker process.

### 1.3 Definitions

| Term | Meaning |
|------|---------|
| **User** | Authenticated human using the platform |
| **Agent** | A named AI specialist persona with system prompt and routing key |
| **RAG** | Retrieval-Augmented Generation over ingested documents |
| **JWT** | JSON Web Token for API authentication |

### 1.4 References

- Repository root `README.md`
- `docs/SSD.md` — architecture and feature-to-code traceability
- OpenAPI: `{API_BASE}/docs` when the API is running

---

## 2. Overall description

### 2.1 Product perspective

The product is a **client–server** application. The client never connects directly to the database; all privileged operations go through the API with bearer JWTs (except explicitly public endpoints such as health, course catalogue read, tools list, and plan listing where implemented).

### 2.2 User classes

| Class | Description |
|-------|-------------|
| **Guest** | Unauthenticated visitor; landing, public catalogue where allowed |
| **Student** | Default learning-oriented role |
| **Business owner** | Business module and related AI features |
| **Teacher / Consultant** | Domain roles (authorization rules per endpoint) |
| **Admin** | User/course moderation and aggregate statistics |

### 2.3 Operating constraints

- **CORS:** API shall accept browser calls only from origins listed in `CORS_ORIGINS`.
- **HTTPS:** Production deployments shall serve the SPA and API over TLS; the client shall be configured with `NEXT_PUBLIC_API_URL` using `https`.
- **LLM availability:** Chat and AI endpoints require valid provider keys (e.g. `GROQ_API_KEY`) to satisfy latency and availability expectations.

### 2.4 Assumptions and dependencies

- PostgreSQL is reachable with async SQLAlchemy URLs as configured.
- Redis is available wherever Celery workers are run.
- Vector store path is writable when RAG or document ingest is used.

---

## 3. External interface requirements

### 3.1 User interface (web)

- **REQ-UI-001:** The system shall provide a responsive marketing landing page (hero, features, pricing, FAQ, footer).
- **REQ-UI-002:** The system shall provide authenticated **dashboard** navigation (sidebar; collapsible / sheet navigation on small viewports).
- **REQ-UI-003:** The system shall support **theme** toggling (light/dark) where implemented in the UI shell.
- **REQ-UI-004:** The system shall support **language switching** among at least **English, Amharic, Afaan Oromo, and Somali** for UI strings provided in the translation bundle.
- **REQ-UI-005:** The **chat** interface shall allow choosing an agent, composing messages, viewing streamed assistant output as Markdown, and **speech input** via the browser Web Speech API where supported.

### 3.2 Hardware / software interfaces

- **REQ-HW-001:** Client shall run in evergreen desktop and mobile browsers that support modern JavaScript, `fetch`, and ES modules.

### 3.3 API interface

- **REQ-API-001:** The API shall expose **OpenAPI 3** documentation at `/docs` and `/redoc`.
- **REQ-API-002:** All versioned resources shall live under prefix **`/api/v1`**.
- **REQ-API-003:** Authenticated requests shall accept **`Authorization: Bearer <access_token>`** unless an endpoint is explicitly public.

### 3.4 External systems

- **REQ-EXT-001:** The system shall integrate with **Groq** for primary chat/completion behavior.
- **REQ-EXT-002:** The system may integrate with **OpenAI** for embeddings when `OPENAI_API_KEY` is set.
- **REQ-EXT-003:** The system shall validate **Google** ID tokens for optional Google login via Google’s token introspection endpoint as implemented.

---

## 4. Functional requirements

### 4.1 Authentication and identity

| ID | Requirement |
|----|-------------|
| REQ-AUTH-001 | The system shall allow **registration** with email and password and return access + refresh tokens and a user profile. |
| REQ-AUTH-002 | The system shall allow **login** with email and password (JSON and OAuth2 form compatibility for tooling). |
| REQ-AUTH-003 | The system shall issue **JWT access tokens** and opaque **refresh tokens** with server-side session records. |
| REQ-AUTH-004 | The system shall allow **token refresh** and **logout** (session invalidation). |
| REQ-AUTH-005 | The system shall expose **current user** profile at `/auth/me` (and mirror under `/users/me` as implemented). |
| REQ-AUTH-006 | The system shall support **password forgot/reset** and **email verification** API contracts (delivery depends on mail integration). |
| REQ-AUTH-007 | The system shall support **Google** authentication using a client-supplied ID token validated with Google. |
| REQ-AUTH-008 | The system shall support **profile update** for the authenticated user. |

### 4.2 Authorization

| ID | Requirement |
|----|-------------|
| REQ-AUZ-001 | The system shall associate each user with exactly one **role** from the defined enumeration (student, business_owner, teacher, consultant, admin). |
| REQ-AUZ-002 | The system shall restrict **admin** endpoints to privileged users per server-side dependency rules. |

### 4.3 AI chat and agents

| ID | Requirement |
|----|-------------|
| REQ-CHAT-001 | The system shall expose a catalogue of **at least ten** specialist agents with stable keys and human-readable names. |
| REQ-CHAT-002 | The system shall persist **conversations** and **messages** per authenticated user. |
| REQ-CHAT-003 | The system shall support **listing**, **creating**, **loading**, and **deleting** conversations. |
| REQ-CHAT-004 | The system shall provide a **streaming** completion endpoint that persists user and assistant turns. |
| REQ-CHAT-005 | The system shall **classify** user intent to select an agent automatically unless the client **forces** a specific agent. |
| REQ-CHAT-006 | The system shall optionally enrich responses using **RAG** over ingested text when configured. |
| REQ-CHAT-007 | The system shall expose **chat statistics** for dashboard use. |

### 4.4 Learning (Academy)

| ID | Requirement |
|----|-------------|
| REQ-LEARN-001 | The system shall list **published** courses with pagination and filters (category, level, language, free flag, text search). |
| REQ-LEARN-002 | The system shall return course detail including **ordered lessons**. |
| REQ-LEARN-003 | The system shall allow an authenticated user to **enroll** in a course (idempotent if already enrolled). |
| REQ-LEARN-004 | The system shall list the user’s **enrollments**. |
| REQ-LEARN-005 | The system shall record **lesson completion** and recompute **course progress percentage**, marking course completion at 100%. |

*Note:* ORM models include quizzes and certificates; HTTP coverage for every learning artifact is described in SSD; extend SRS when those endpoints are finalized.

### 4.5 Business consulting

| ID | Requirement |
|----|-------------|
| REQ-BIZ-001 | The system shall support **CRUD** (create, read, update, list) of business profiles for the owning user. |
| REQ-BIZ-002 | The system shall allow **document attachment** to a business with asynchronous **text extraction and vector ingest** when workers run. |
| REQ-BIZ-003 | The system shall generate a **structured multi-section business report** using a defined LangGraph workflow (diagnosis, SWOT, automation plan, marketing plan, synthesis). |
| REQ-BIZ-004 | The system shall list **historical reports** per business. |

### 4.6 Automation center

| ID | Requirement |
|----|-------------|
| REQ-AUTO-001 | The system shall expose **automation templates** and a **generate-from-template** action. |
| REQ-AUTO-002 | The system shall persist user **automations** and support **create**, **list**, and **toggle** (active/paused lifecycle). |

### 4.7 Agriculture

| ID | Requirement |
|----|-------------|
| REQ-AGR-001 | The system shall provide **crop recommendation** assistance via an API endpoint. |
| REQ-AGR-002 | The system shall provide **pest / symptom diagnosis** assistance via an API endpoint. |
| REQ-AGR-003 | The system shall provide **weather-oriented** advisory text via an API endpoint. |
| REQ-AGR-004 | The system shall expose **market price** information via an API endpoint (implementation may be static or stubbed— verify for production). |

### 4.8 Career coach

| ID | Requirement |
|----|-------------|
| REQ-CAR-001 | The system shall generate or assist with **resume** content via API. |
| REQ-CAR-002 | The system shall generate **cover letters** via API. |
| REQ-CAR-003 | The system shall run **interview simulation** via API. |
| REQ-CAR-004 | The system shall provide **skill assessment** via API. |

### 4.9 Community

| ID | Requirement |
|----|-------------|
| REQ-COM-001 | The system shall support **forum posts** with pagination, creation, and read-by-slug. |
| REQ-COM-002 | The system shall support **comments** on posts. |
| REQ-COM-003 | The system shall support **reactions** on posts. |

### 4.10 AI tools directory

| ID | Requirement |
|----|-------------|
| REQ-TOOL-001 | The system shall serve a **curated catalogue** of external AI tools with metadata (category, pricing, rating, URL). |
| REQ-TOOL-002 | The system shall support **detail by slug** and **category listing**. |

### 4.11 Notifications

| ID | Requirement |
|----|-------------|
| REQ-NOTIF-001 | The system shall list **in-app notifications** for the authenticated user. |
| REQ-NOTIF-002 | The system shall expose an **unread count**. |
| REQ-NOTIF-003 | The system shall support marking one or **all** notifications as read. |

### 4.12 Payments and subscriptions

| ID | Requirement |
|----|-------------|
| REQ-PAY-001 | The system shall describe **subscription plans** (Free, Pro, Enterprise) with feature lists. |
| REQ-PAY-002 | The system shall expose the user’s **current subscription** state. |
| REQ-PAY-003 | The system shall provide **checkout** and **cancel** endpoints intended for Stripe integration (production completeness is deployment-dependent). |

### 4.13 Administration

| ID | Requirement |
|----|-------------|
| REQ-ADM-001 | The system shall expose **aggregate statistics** for operators. |
| REQ-ADM-002 | The system shall support **paginated user listing**, **role changes**, and **user disablement**. |
| REQ-ADM-003 | The system shall expose **course moderation** listing. |

### 4.14 Health and observability

| ID | Requirement |
|----|-------------|
| REQ-OPS-001 | The system shall expose a **health** endpoint suitable for orchestration probes. |
| REQ-OPS-002 | The system shall expose a minimal **ping** endpoint. |
| REQ-OPS-003 | The API shall attach **request identifiers** and **response timing** headers for tracing. |

### 4.15 Background processing

| ID | Requirement |
|----|-------------|
| REQ-WKR-001 | The system shall queue **document ingest** tasks to parse text and index into the vector store. |
| REQ-WKR-002 | The system shall define **email send** and **PDF report** tasks (stubs until external services are wired). |

---

## 5. Non-functional requirements

### 5.1 Performance

| ID | Requirement |
|----|-------------|
| REQ-NF-PERF-001 | Chat streaming shall begin emitting tokens without materializing the full completion in memory on the client before stream start (server obeys streaming semantics). |
| REQ-NF-PERF-002 | Public list endpoints shall support **pagination** to bound payload size. |

### 5.2 Security

| ID | Requirement |
|----|-------------|
| REQ-NF-SEC-001 | Passwords shall be stored using a strong one-way hash (never plaintext). |
| REQ-NF-SEC-002 | Refresh tokens shall be stored only as **hashes** server-side. |
| REQ-NF-SEC-003 | The API shall emit baseline **security headers** (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). |
| REQ-NF-SEC-004 | The API shall enforce **per-IP rate limits** for abuse mitigation (configurable per minute). |

### 5.3 Reliability and maintainability

| ID | Requirement |
|----|-------------|
| REQ-NF-REL-001 | Database schema changes shall be managed via **Alembic** migrations. |
| REQ-NF-REL-002 | The backend shall use **structured logging** for operational diagnosis. |

### 5.4 Portability and deployment

| ID | Requirement |
|----|-------------|
| REQ-NF-DEP-001 | The system shall ship **Dockerfiles** for API and web images. |
| REQ-NF-DEP-002 | The system shall provide **docker-compose** for local/full-stack demonstration including Postgres, Redis, API, worker, web, and reverse proxy. |
| REQ-NF-DEP-003 | Documentation shall describe **Vercel** and **Render** deployment patterns for split hosting. |

---

## 6. Data retention and privacy (requirements placeholder)

| ID | Requirement |
|----|-------------|
| REQ-PRV-001 | The production deployment shall define retention policies for chat logs, uploads, and PII consistent with applicable law (to be specified by the operator). |
| REQ-PRV-002 | Secrets and keys shall not be stored in the repository (use secret managers). |

---

## 7. Acceptance criteria (high level)

- A user can **register**, **log in**, and call **`/auth/me`** with the issued bearer token.
- A user can **open chat**, **stream** a reply, and **reload** the conversation with messages intact.
- A user can **browse courses**, **enroll**, and **complete a lesson** with progress updating.
- A user can **create a business**, **attach a document** (where storage is configured), and request an **analysis** that returns structured sections.
- An **admin** can load **admin stats** and **user list** when authenticated with sufficient privilege.
- **`/api/v1/health/health`** returns success when the API and its dependencies are healthy.

---

## 8. Traceability

| SRS section | Design document |
|-------------|-----------------|
| §4 Functional | `docs/SSD.md` §5 Feature catalog |
| §3–5 Interfaces & NFR | `docs/SSD.md` §4, §8, §9 |
| Deployment | `docs/SSD.md` §9, `docs/vercel.md`, `docs/render-vercel.md` |

---

## 9. Document history

| Version | Date | Authoring note |
|---------|------|----------------|
| 1.0 | 2026-05-16 | Initial SRS from implemented behavior |

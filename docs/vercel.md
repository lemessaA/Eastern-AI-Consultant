# Deploy **frontend + backend** on Vercel (two projects)

Use **two Vercel projects** connected to **the same Git repository**, with **different Root Directory** values:

| Project | Root Directory | Purpose |
|---------|----------------|---------|
| **Web** | `frontend` | Next.js 15 app |
| **API** | `backend` | FastAPI (single Vercel Function via [official FastAPI on Vercel](https://vercel.com/docs/frameworks/backend/fastapi)) |

The backend entrypoint is already defined in **`backend/pyproject.toml`**:

```toml
[tool.vercel]
entrypoint = "app.main:app"
```

---

## 0. Prerequisites

1. Repo pushed to **GitHub**, **GitLab**, or **Bitbucket** (Vercel imports from git).
2. **Managed PostgreSQL** reachable from the public internet ([Neon](https://neon.tech), [Supabase](https://supabase.com), [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), Render Postgres external URL, etc.).
3. **Redis** optional but recommended (`REDIS_URL`) — [Upstash](https://upstash.com) works well (`rediss://…`).
4. **`GROQ_API_KEY`** (primary LLM); optional **`OPENAI_API_KEY`** for embeddings/models.
5. Understand limits: **[Vercel Functions limitations](https://vercel.com/docs/functions/limitations)** (timeouts, bundle size ~500 MB guideline, cold starts). This repo is **heavy** (LangChain, ChromaDB, etc.); if **Python install or deploy fails**, use Docker on **[Render](./render-vercel.md)** instead.

---

## 1. Create the **API** project (deploy this first)

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New…** → **Project**.
2. **Import** your repository.
3. **Root Directory:** set to **`backend`** (“Edit” next to Repository if needed).
4. Framework **Python** / **FastAPI** should be detected (`pyproject.toml` + `tool.vercel.entrypoint`).
5. **Environment Variables** (Production). Minimum set:

   | Variable | Example / notes |
   |----------|-----------------|
   | `ENVIRONMENT` | `production` |
   | `DEBUG` | `false` |
   | `DATABASE_URL` | `postgresql+asyncpg://USER:PASSWORD@HOST/DB` |
   | `SYNC_DATABASE_URL` | `postgresql+psycopg2://…` — for **Alembic** migrations from CI/local |
   | `REDIS_URL` | `redis://…` or `rediss://…` (Upstash) |
   | `SECRET_KEY` | Long random string |
   | `JWT_SECRET` | Long random string |
   | `CORS_ORIGINS` | **Comma-separated.** After you know frontend URL(s), set e.g. `https://your-app.vercel.app` (add preview URLs separately if needed). Temporarily wrong CORS → fix → **Redeploy** backend. |
   | `GROQ_API_KEY` | From [Groq console](https://console.groq.com) |
   | `OPENAI_API_KEY` | If you use OpenAI |
   | `GOOGLE_REDIRECT_URI` | `https://YOUR-API-PROJECT.vercel.app/api/v1/auth/google/callback` (match final API URL) |

   Mirror the rest from [`backend/.env.example`](../backend/.env.example) (`STORAGE_BACKEND`, S3/Cloudinary, etc.).

6. **`CORS_ORIGINS` note:** Until the frontend exists, you can skip or use a placeholder, then update when the frontend project gets its `.vercel.app` URL and **Redeploy** the API.

7. **Ephemeral filesystem:** avoid relying on **`local`** disk for durable uploads/RAG paths. Prefer **`cloudinary`** or **`s3`** (`STORAGE_BACKEND` + credentials). **Do not** put `functions` glob patterns targeting `app/**/*.py` in **`vercel.json`** — they fail the build (“doesn't match … inside the `api` directory”). Framework FastAPI uses **`[tool.vercel]`** instead. For **streaming / LLM timeouts**, raise **Function Max Duration** under **Project → Settings → Functions** ([duration docs](https://vercel.com/docs/functions/configuring-functions/duration)).

8. **Deploy.**

9. **Smoke test:** `https://<api-project>.vercel.app/` and **`/docs`**.

---

## 2. Database migrations (Alembic)

Serverless deployments do **not** automatically run **`alembic upgrade head`** for you unless you add a step.

Pick one:

- Run from your laptop (or CI) against production:

  ```bash
  cd backend
  export SYNC_DATABASE_URL="postgresql+psycopg2://..."
  alembic upgrade head
  ```

- Or add a **GitHub Action** on merge to `main` that installs Python, sets `SYNC_DATABASE_URL` from secrets, and runs **`alembic upgrade head`**.

Optional seed (rotate passwords afterward):

```bash
# Same DB as production — use only if intentional
DATABASE_URL=... SYNC_DATABASE_URL=... python -m scripts.seed
```

---

## 3. Create the **Frontend** project

1. **Add New…** → **Project** → **same repository** (again).
2. **Root Directory:** **`frontend`**.
3. Framework: **Next.js** — default build (`npm run build`).
4. **Environment variables:**

   | Variable | Example |
   |----------|---------|
   | **`NEXT_PUBLIC_API_URL`** | `https://your-api-project.vercel.app` — **no trailing slash** |
   | **`NEXT_PUBLIC_APP_URL`** | `https://your-web-project.vercel.app` |
   | `NEXT_PUBLIC_APP_NAME` | Optional |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | If using Google OAuth in UI |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | If Stripe in UI |

5. **Deploy.**

6. If you change **`NEXT_PUBLIC_*`**, trigger a **new deployment** (rebuild required).

---

## 4. Connect API ↔ Frontend

1. **Backend** **`CORS_ORIGINS`:** must include **`https://<your-frontend-host>`** exactly (scheme + hostname, **no trailing slash**, no path). Add multiple comma-separated origins for preview deployments if needed.
2. **Frontend** **`NEXT_PUBLIC_API_URL`:** backend base URL (same as Swagger host without `/docs`).
3. **Redeploy API** after CORS edits.
4. In the browser, open frontend → login/API call → **Network** tab: requests should hit the API hostname; **CORS** errors usually mean **`CORS_ORIGINS`** missing or typo.

---

## 5. Google OAuth (optional)

1. Google Cloud Console → **Credentials** → OAuth **Web client**.
2. **Authorized redirect URIs:**  
   `https://YOUR-API-HOST.vercel.app/api/v1/auth/google/callback`
3. **Authorized JavaScript origins:**  
   `https://YOUR-FRONTEND-HOST.vercel.app`
4. Copy **Client ID** → Vercel **API**: `GOOGLE_CLIENT_ID`; **Frontend** (public): **`NEXT_PUBLIC_GOOGLE_CLIENT_ID`**.
5. **Client secret** → API **`GOOGLE_CLIENT_SECRET`** only.
6. **API:** `GOOGLE_REDIRECT_URI` must match redirect URI exactly.
7. Redeploy both if URLs change.

---

## 6. Custom domains

Per project → **Settings** → **Domains** (e.g. `api.example.com`, `www.example.com`).

Update **`CORS_ORIGINS`**, **`NEXT_PUBLIC_APP_URL`**, **`NEXT_PUBLIC_API_URL`**, **`GOOGLE_*`**.

---

## 7. Celery / background workers

**Celery does not run** inside Vercel’s FastAPI deployment. Run workers on:

- Railway / Render / Fly / a VPS with the **`backend/Dockerfile`** (or Celery CMD),  
  same **`REDIS_URL`** and **`DATABASE_URL`**.

---

## 8. CLI (optional)

```bash
npm i -g vercel

cd backend && vercel link   # attach to API project
vercel --prod

cd frontend && vercel link  # attach to Web project
vercel --prod
```

Each directory gets its **own** linked project.

---

## 9. Troubleshooting

| Issue | Action |
|--------|--------|
| **Python install / build too large** | Trim optional deps or move API to [Render](./render-vercel.md) Docker. |
| **Import errors on Vercel** | Confirm **Root Directory** is **`backend`**, **`entrypoint`** = **`app.main:app`**. |
| **Timeouts on chat/stream** | **Settings → Functions** → **Max Duration**. Avoid invalid `functions` globs on framework FastAPI. Pro caps: [limits](https://vercel.com/docs/functions/limitations). |
| **CORS errors** | Fix **`CORS_ORIGINS`**; redeploy API. |
| **Frontend calls `localhost:8000` in production** | Set **`NEXT_PUBLIC_API_URL`** to the deployed API (`https://…`) in the **frontend** project; missing value falls back to localhost until you **redeploy** the web app. |
| **Database errors** | Verify **`postgresql+asyncpg://`** scheme; some hosts require SSL query params (`?ssl=require`) — see provider docs. |

---

## Prefer the API on Render instead?

Heavy stacks often deploy more reliably under Docker: **[docs/render-vercel.md](./render-vercel.md)** and repo root **`render.yaml`**.

# Deploying on Vercel (frontend + API separately)

Use **two Vercel projects** from the same Git repository, each with a different **Root Directory** so builds stay isolated.

Official reference: [Deploy a FastAPI app on Vercel](https://vercel.com/docs/frameworks/backend/fastapi) and [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs).

> **Prefer the API on Render?** Heavy Python stacks often fit better there; keep only the frontend on Vercel and follow **[docs/render-vercel.md](./render-vercel.md)** (`render.yaml` at repo root).

---

## 1. Frontend (Next.js)

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New…** → **Project** → import this repo.
2. **Root Directory:** `frontend`
3. Framework preset: **Next.js** (detected from `package.json`).
4. **Settings → Environment Variables** (Production + Preview as needed):

   | Name | Example | Notes |
   |------|---------|--------|
   | `NEXT_PUBLIC_API_URL` | `https://your-api.vercel.app` | Public API origin (no trailing slash). |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Site URL for links / OAuth client config. |
   | `NEXT_PUBLIC_APP_NAME` | `Eastern AI Consultant` | Optional branding. |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | _(from Google Cloud)_ | If you use Google sign-in in the browser. |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | _(if billing enabled)_ | Stripe publishable key. |

5. Deploy. Update **Preview** branch env if previews should hit a staging API.

---

## 2. Backend (FastAPI)

1. **Add New…** → **Project** again (second project) → same repo.
2. **Root Directory:** `backend`
3. Vercel detects **Python** / **FastAPI** using `pyproject.toml`. The app entry is set by:

   ```toml
   [tool.vercel]
   entrypoint = "app.main:app"
   ```

4. **Environment variables** — mirror `backend/.env.example` in the Vercel project (Production + Preview). Important ones:

   | Name | Notes |
   |------|--------|
   | `ENVIRONMENT` | Use `production` for prod. |
   | `DEBUG` | `false` in production. |
   | `DATABASE_URL` | Async URL, e.g. `postgresql+asyncpg://…` (Neon, Supabase, etc.). |
   | `SYNC_DATABASE_URL` | Sync driver for Alembic/scripts if you run migrations from CI (optional on Vercel). |
   | `REDIS_URL` | Upstash or another Redis URL if you use caching / rate limits that need Redis. |
   | `SECRET_KEY`, `JWT_SECRET` | Strong random values. |
   | `CORS_ORIGINS` | Comma-separated; **must include** your frontend origin, e.g. `https://your-app.vercel.app`. |
   | `GROQ_API_KEY` | Required for Groq-backed agents. |
   | `OPENAI_API_KEY` | If you use OpenAI embeddings or models. |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Redirect URI must be the **API** URL, e.g. `https://your-api.vercel.app/api/v1/auth/google/callback`. |
   | `STORAGE_BACKEND`, `CLOUDINARY_URL` / S3 vars | Prefer `s3` or `cloudinary`; `local` disk is ephemeral on serverless. |
   | `VECTOR_STORE_PATH`, `UPLOAD_DIR` | Prefer external/object storage — serverless disks are ephemeral. |

5. Deploy and open `https://<your-api>.vercel.app/docs` to verify.

### Backend limitations on Vercel

- Runs as **[Vercel Functions](https://vercel.com/docs/functions)** ([Fluid compute](https://vercel.com/docs/fluid-compute) by default): **timeouts**, **cold starts**, and **[bundle limits](https://vercel.com/docs/functions/limitations)** apply. This repo pulls in large ML/RAG stacks; if installs or bundles fail on Vercel, deploy the API with **Railway / Render / Fly / AWS** using `backend/Dockerfile`.
- **Celery workers** do not run on Vercel; run workers elsewhere with the same `REDIS_URL` and DB.
- **Secrets:** never commit `.env`; configure values in **Vercel → Environment Variables**.

---

## 3. Wire frontend ↔ API

1. Set `NEXT_PUBLIC_API_URL` on the **frontend** to the deployed **backend** URL.
2. Set backend `CORS_ORIGINS` to include every **frontend** URL (preview + production as needed).
3. Redeploy the frontend after env changes.

---

## 4. Custom domains

In each project → **Settings → Domains** (for example `app.example.com` and `api.example.com`). Update env vars and Google OAuth redirects to match.

---

## 5. CLI (optional)

From each app directory:

```bash
npm i -g vercel

cd frontend && vercel link && vercel --prod
cd backend && vercel link && vercel --prod
```

Use **separate** `vercel link` mappings so each directory attaches to the correct Vercel project.

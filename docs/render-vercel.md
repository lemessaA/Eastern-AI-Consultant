# Backend on Render · Frontend on Vercel

> **Both apps on Vercel instead:** [vercel.md](./vercel.md)

This split fits this repo well: **Render** runs the Dockerized FastAPI app (heavy deps, long requests, Celery-friendly host options), while **Vercel** hosts the Next.js frontend.

Official docs: [Render Docker deploy](https://render.com/docs/docker), [Blueprint spec](https://render.com/docs/blueprint-spec), [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs).

---

## 1. Postgres & Redis on Render (recommended)

Create managed services (or bring your own):

1. **[New → PostgreSQL](https://dashboard.render.com/)** → copy **Internal Database URL**.
2. **[New → Redis](https://dashboard.render.com/)** → copy **Internal Redis URL**.

**`DATABASE_URL` for this app:** Render gives a `postgresql://…` URI. Async SQLAlchemy expects `postgresql+asyncpg://`:

- Replace `postgres://` or `postgresql://` with **`postgresql+asyncpg://`** (same user, password, host, port, DB name).

**`SYNC_DATABASE_URL`** (Alembic / Celery scripts): use **`postgresql+psycopg2://`** with the same parts, or reuse the JDBC-style host from Render’s **External** URL if scripts run outside Render.

---

## 2. API — Web Service (Docker)

### Option A: Blueprint (`render.yaml`)

Repo root includes [`render.yaml`](../render.yaml). In Render:

1. **Blueprint** → link this repo → apply.
2. Open the **`eastern-ai-api`** service → **Environment** → fill every **`sync: false`** / unset secret (`DATABASE_URL`, `REDIS_URL`, `CORS_ORIGINS`, OAuth, `GROQ_API_KEY`, `CLOUDINARY_URL`, etc.).
3. **Redeploy** after env is complete.

`SECRET_KEY` / `JWT_SECRET` use `generateValue: true`; you may replace them in the dashboard with your own strong values.

### Option B: Manual Web Service

1. **New → Web Service** → same repo.
2. **Runtime:** Docker.
3. **Dockerfile path:** `backend/Dockerfile`
4. **Docker build context:** `backend`
5. **Health check path:** `/api/v1/health`
6. Add environment variables from `backend/.env.example` (Production values).

Persistent disk notes: ephemeral filesystem on web instances — use **S3** or **Cloudinary** for uploads; `render.yaml` sets `UPLOAD_DIR` / `VECTOR_STORE_PATH` under `/tmp` for minimal local paths; tune for your storage strategy.

**Celery:** run a separate **Background Worker** on Render pointing at the same `REDIS_URL` and image/Docker context, or leave workers off until you add a worker service.

---

## 3. Frontend — Vercel

1. [Vercel](https://vercel.com) → **Add project** → this repo.
2. **Root Directory:** `frontend`
3. Framework: **Next.js**.

**Environment variables** (Production; Preview optional for staging API):

| Name | Example |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://eastern-ai-api.onrender.com` (your Render hostname, **no** trailing slash) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

See also [`frontend/vercel.json`](../frontend/vercel.json) and [`frontend/.env.example`](../frontend/.env.example).

---

## 4. Connect the two

| Where | Setting |
|--------|---------|
| **Vercel** | `NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com` |
| **Render** (`CORS_ORIGINS`) | Include your Vercel URL(s), comma-separated: `https://your-app.vercel.app,https://*.vercel.app` if you rely on previews (narrow preview URLs when possible). |
| **Google OAuth** (`GOOGLE_REDIRECT_URI` on Render) | `https://<render-service>.onrender.com/api/v1/auth/google/callback` |

Redeploy the frontend after changing `NEXT_PUBLIC_*`.

---

## 5. Custom domains

| Service | Domain example |
|---------|----------------|
| Render API | `api.yourdomain.com` → map in Render → **Custom Domains** |
| Vercel app | `app.yourdomain.com` |

Update **`CORS_ORIGINS`**, **`NEXT_PUBLIC_*`**, **`GOOGLE_REDIRECT_URI`** to match HTTPS production URLs.

---

## 6. Cold starts / sleep

Free/starter tiers may **spin down** after idle; first request can be slow. For production UX, upgrade to **always-on** or accept warm-up pings (ensure they hit a cheap route).

---

## Related

- [docs/vercel.md](./vercel.md) — deploying **both** stack pieces on Vercel (alternative; heavier limits on Python).

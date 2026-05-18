# Google Sign-In setup

Eastern AI uses **Google Identity Services** (ID token) on the frontend and **`POST /api/v1/auth/google`** on the API.

## 1. Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**
2. **Create credentials** → **OAuth client ID** → type **Web application**
3. **Authorized JavaScript origins** (required):
   - `http://localhost:3000`
   - `https://your-frontend.vercel.app` (and custom domain if any)
4. **Authorized redirect URIs** — not required for the current button flow (only needed for server redirect OAuth).

Copy the **Client ID** and **Client secret**.

## 2. Environment variables

| Where | Variable | Value |
|-------|----------|--------|
| **Backend** | `GOOGLE_CLIENT_ID` | Same Web client ID |
| **Backend** | `GOOGLE_CLIENT_SECRET` | From console (keep secret) |
| **Frontend** | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Same Web client ID |

Local example (`frontend/.env.local` and `backend/.env`):

```env
GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
```

Restart **API** and **Next.js** after changing env vars. On Vercel, redeploy the frontend after setting `NEXT_PUBLIC_*`.

## 3. Verify

1. Open `/auth/login` — **Continue with Google** should be enabled (not greyed out).
2. Sign in → you should land on `/dashboard` with a session.
3. API: `GET /api/v1/auth/google/status` → `{"enabled": true}` when `GOOGLE_CLIENT_ID` is set.

## Behavior

- **New user:** account created, email marked verified, linked `oauth_accounts` row.
- **Existing email/password user:** same email can sign in with Google; Google account is linked.
- **Disabled account:** returns `403`.

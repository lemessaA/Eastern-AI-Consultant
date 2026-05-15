// =============================================================================
// Typed API client for the FastAPI backend.
// Uses fetch + a thin error layer; persists JWTs via Zustand store.
// =============================================================================

import { useAuthStore } from "@/store/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";
const API_BASE = `${API_URL}/api/v1`;

export class APIError extends Error {
  constructor(public status: number, message: string, public detail?: unknown) {
    super(message);
  }
}

interface RequestOptions extends RequestInit {
  json?: unknown;
  auth?: boolean;
}

async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { json, auth = true, headers, ...rest } = opts;
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };
  if (json !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });

  if (!res.ok) {
    let detail: unknown;
    try {
      detail = await res.json();
    } catch {
      detail = await res.text();
    }
    const message =
      typeof detail === "object" && detail && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : res.statusText;
    if (res.status === 401) {
      useAuthStore.getState().clear();
    }
    throw new APIError(res.status, message, detail);
  }

  if (res.status === 204) return undefined as T;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

export const api = {
  get: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, json?: unknown, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: "POST", json }),
  patch: <T>(path: string, json?: unknown, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: "PATCH", json }),
  put: <T>(path: string, json?: unknown, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: "PUT", json }),
  delete: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { ...opts, method: "DELETE" }),

  upload: async <T>(path: string, file: File, extra: Record<string, string> = {}) => {
    const form = new FormData();
    form.append("file", file);
    for (const [k, v] of Object.entries(extra)) form.append(k, v);
    return request<T>(path, { method: "POST", body: form });
  },
};

export { API_BASE, API_URL };

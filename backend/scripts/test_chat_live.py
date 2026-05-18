#!/usr/bin/env python3
"""Manual live smoke test for chat against a running API (default http://127.0.0.1:8000)."""

from __future__ import annotations

import json
import os
import sys
import tempfile

import httpx

BASE = os.environ.get("API_BASE", "http://127.0.0.1:8000").rstrip("/")
EMAIL = os.environ.get("TEST_EMAIL", "admin@eastern.ai")
PASSWORD = os.environ.get("TEST_PASSWORD", "admin12345")


def ok(msg: str) -> None:
    print(f"  ✔ {msg}")


def fail(msg: str) -> None:
    print(f"  ✘ {msg}")
    sys.exit(1)


def main() -> None:
    print(f"Chat live test → {BASE}")
    with httpx.Client(timeout=120.0) as client:
        # Health
        r = client.get(f"{BASE}/api/v1/health")
        if r.status_code != 200:
            fail(f"health: {r.status_code} {r.text}")
        ok("health")

        # Agents (public)
        r = client.get(f"{BASE}/api/v1/agents")
        if r.status_code != 200 or len(r.json()) < 1:
            fail(f"agents: {r.status_code}")
        ok(f"agents ({len(r.json())} specialists)")

        # Login
        r = client.post(
            f"{BASE}/api/v1/auth/login",
            json={"email": EMAIL, "password": PASSWORD},
        )
        if r.status_code != 200:
            fail(f"login: {r.status_code} {r.text}")
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        ok(f"login as {EMAIL}")

        # Upload
        with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as fh:
            fh.write("Live test: Eastern AI Consultant chat file upload.")
            path = fh.name
        try:
            with open(path, "rb") as fh:
                r = client.post(
                    f"{BASE}/api/v1/chat/upload",
                    headers=headers,
                    files={"file": ("live-test.txt", fh, "text/plain")},
                )
            if r.status_code != 200:
                fail(f"upload: {r.status_code} {r.text}")
            attachment = r.json()
            ok(f"upload ({attachment['filename']}, {attachment['size_bytes']} bytes)")
        finally:
            os.unlink(path)

        # Stream (real LLM if GROQ_API_KEY is set)
        r = client.post(
            f"{BASE}/api/v1/chat/stream",
            headers={**headers, "Accept": "text/event-stream"},
            json={
                "message": "Reply with exactly: CHAT_OK",
                "agent_type": "teacher",
                "language": "en",
                "attachments": [attachment],
            },
        )
        if r.status_code != 200:
            fail(f"stream: {r.status_code} {r.text}")
        body = r.text
        if "event: done" not in body:
            fail("stream: missing done event")
        if "event: error" in body:
            fail("stream: error event in SSE")
        tokens = "".join(
            json.loads(line[6:])["text"]
            for block in body.split("\n\n")
            for line in block.split("\n")
            if line.startswith("data: ") and '"text"' in line
        )
        ok(f"stream ({len(tokens)} chars from model)")

        conv_id = None
        for block in body.split("\n\n"):
            if block.startswith("event: meta"):
                for line in block.split("\n"):
                    if line.startswith("data: "):
                        conv_id = json.loads(line[6:]).get("conversation_id")
        if not conv_id:
            fail("stream: no conversation_id in meta")
        ok(f"conversation {conv_id}")

        r = client.get(f"{BASE}/api/v1/chat/conversations/{conv_id}", headers=headers)
        if r.status_code != 200 or len(r.json().get("messages", [])) < 2:
            fail("conversation history")
        ok("conversation history persisted")

    print("\nAll chat live checks passed.")


if __name__ == "__main__":
    main()

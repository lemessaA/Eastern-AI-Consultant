"""AI Tool Directory — curated catalogue with simple in-memory data."""

from __future__ import annotations

from fastapi import APIRouter, Query

router = APIRouter()


TOOLS: list[dict] = [
    {
        "slug": "chatgpt",
        "name": "ChatGPT",
        "category": "writing",
        "pricing": "Free / Plus $20",
        "beginner_friendly": True,
        "rating": 4.8,
        "description": "Conversational AI assistant by OpenAI. Best general-purpose tool.",
        "features": ["Chat", "Images", "Code", "Voice", "Custom GPTs"],
        "url": "https://chat.openai.com",
    },
    {
        "slug": "claude",
        "name": "Claude",
        "category": "writing",
        "pricing": "Free / Pro $20",
        "beginner_friendly": True,
        "rating": 4.7,
        "description": "Anthropic's helpful, harmless, honest AI — excellent at long documents.",
        "features": ["200k context", "Artifacts", "Projects"],
        "url": "https://claude.ai",
    },
    {
        "slug": "perplexity",
        "name": "Perplexity",
        "category": "education",
        "pricing": "Free / Pro $20",
        "beginner_friendly": True,
        "rating": 4.6,
        "description": "AI search engine with citations — perfect for research.",
        "features": ["Citations", "Focused search", "Files"],
        "url": "https://perplexity.ai",
    },
    {
        "slug": "midjourney",
        "name": "Midjourney",
        "category": "design",
        "pricing": "From $10/mo",
        "beginner_friendly": False,
        "rating": 4.7,
        "description": "Premium AI image generation — used by designers worldwide.",
        "features": ["Image gen", "Style refs", "Upscale"],
        "url": "https://midjourney.com",
    },
    {
        "slug": "canva-magic",
        "name": "Canva Magic Studio",
        "category": "design",
        "pricing": "Free / Pro $13",
        "beginner_friendly": True,
        "rating": 4.5,
        "description": "Design + AI text, image and presentation tools in one suite.",
        "features": ["Magic Write", "Magic Edit", "Templates"],
        "url": "https://canva.com",
    },
    {
        "slug": "elevenlabs",
        "name": "ElevenLabs",
        "category": "video-editing",
        "pricing": "Free / from $5",
        "beginner_friendly": True,
        "rating": 4.7,
        "description": "Best-in-class AI voice generation and dubbing.",
        "features": ["TTS", "Voice cloning", "Dubbing"],
        "url": "https://elevenlabs.io",
    },
    {
        "slug": "github-copilot",
        "name": "GitHub Copilot",
        "category": "coding",
        "pricing": "Free for students / $10",
        "beginner_friendly": True,
        "rating": 4.6,
        "description": "AI pair programmer inside VS Code, JetBrains and CLI.",
        "features": ["Autocomplete", "Chat", "CLI"],
        "url": "https://github.com/features/copilot",
    },
    {
        "slug": "cursor",
        "name": "Cursor",
        "category": "coding",
        "pricing": "Free / Pro $20",
        "beginner_friendly": True,
        "rating": 4.8,
        "description": "AI-first code editor with built-in agentic coding.",
        "features": ["Agent mode", "Composer", "Multi-file edits"],
        "url": "https://cursor.com",
    },
    {
        "slug": "notion-ai",
        "name": "Notion AI",
        "category": "productivity",
        "pricing": "$10/user/mo",
        "beginner_friendly": True,
        "rating": 4.5,
        "description": "AI assistant baked into your Notion workspace.",
        "features": ["Summaries", "Q&A", "Translation"],
        "url": "https://notion.so",
    },
    {
        "slug": "groq",
        "name": "Groq",
        "category": "coding",
        "pricing": "Free tier",
        "beginner_friendly": False,
        "rating": 4.9,
        "description": "Ultra-fast LLM inference for Llama / Mixtral / Gemma.",
        "features": ["Sub-second latency", "Free API tier"],
        "url": "https://console.groq.com",
    },
    {
        "slug": "buffer-ai",
        "name": "Buffer AI Assistant",
        "category": "marketing",
        "pricing": "Free / Essentials $6",
        "beginner_friendly": True,
        "rating": 4.4,
        "description": "Schedule + AI-generate social posts for all platforms.",
        "features": ["Auto-post", "AI captions", "Analytics"],
        "url": "https://buffer.com",
    },
    {
        "slug": "plantix",
        "name": "Plantix",
        "category": "agriculture",
        "pricing": "Free",
        "beginner_friendly": True,
        "rating": 4.6,
        "description": "AI crop disease diagnosis from a photo — works offline.",
        "features": ["Photo diagnosis", "Treatments", "Community"],
        "url": "https://plantix.net",
    },
]


@router.get("")
async def list_tools(
    category: str | None = Query(None),
    search: str | None = Query(None),
    beginner_only: bool = Query(False),
) -> list[dict]:
    items = TOOLS
    if category:
        items = [t for t in items if t["category"] == category]
    if beginner_only:
        items = [t for t in items if t.get("beginner_friendly")]
    if search:
        s = search.lower()
        items = [t for t in items if s in t["name"].lower() or s in t["description"].lower()]
    return items


@router.get("/{slug}")
async def get_tool(slug: str) -> dict:
    for t in TOOLS:
        if t["slug"] == slug:
            return t
    return {"error": "not_found"}


@router.get("/categories/list")
async def categories() -> list[str]:
    return sorted({t["category"] for t in TOOLS})

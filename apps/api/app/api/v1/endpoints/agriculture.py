"""Agriculture AI module endpoints."""

from __future__ import annotations

from datetime import date

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.agents import get_agent
from app.core.deps import CurrentUser
from app.core.logging import get_logger
from app.models.enums import AgentType, Language

router = APIRouter()
logger = get_logger(__name__)


class CropRecommendationRequest(BaseModel):
    location: str = Field(min_length=2, max_length=120)
    soil_type: str | None = None
    season: str | None = None
    farm_size_hectares: float | None = None
    irrigation: bool | None = None
    language: Language = Language.EN


class PestDiagnosisRequest(BaseModel):
    crop: str
    symptoms: str = Field(min_length=10, max_length=2000)
    photo_url: str | None = None
    language: Language = Language.EN


class WeatherRequest(BaseModel):
    latitude: float
    longitude: float


@router.post("/crop-recommendation")
async def crop_recommendation(payload: CropRecommendationRequest, user: CurrentUser) -> dict:
    agent = get_agent(AgentType.AGRICULTURE)
    prompt = (
        "Recommend the best 3 crops for this farm. Return a Markdown table with: "
        "Crop | Why it fits | Expected yield (per ha) | Estimated market price | Risks.\n\n"
        f"Location: {payload.location}\n"
        f"Soil: {payload.soil_type or 'unknown'}\n"
        f"Season: {payload.season or 'auto'}\n"
        f"Farm size (ha): {payload.farm_size_hectares or 'unknown'}\n"
        f"Irrigation: {payload.irrigation if payload.irrigation is not None else 'unknown'}"
    )
    response = await agent.invoke(prompt, language=payload.language)
    return {"recommendation": response.content}


@router.post("/pest-diagnosis")
async def pest_diagnosis(payload: PestDiagnosisRequest, user: CurrentUser) -> dict:
    agent = get_agent(AgentType.AGRICULTURE)
    photo_block = f"\n\nPhoto reference: {payload.photo_url}" if payload.photo_url else ""
    prompt = (
        "The farmer reports the following symptoms on their crop. List the 3 most "
        "likely diseases or pests with: cause, IPM treatment, prevention.\n\n"
        f"Crop: {payload.crop}\nSymptoms: {payload.symptoms}{photo_block}"
    )
    response = await agent.invoke(prompt, language=payload.language)
    return {"diagnosis": response.content}


@router.post("/weather")
async def weather(payload: WeatherRequest) -> dict:
    """Free 7-day forecast via open-meteo.com — no API key required."""
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": payload.latitude,
                    "longitude": payload.longitude,
                    "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
                    "timezone": "auto",
                },
            )
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPError as exc:
        logger.warning("weather_failed", error=str(exc))
        raise HTTPException(status_code=502, detail="Weather service unavailable") from exc


@router.get("/market-prices")
async def market_prices() -> dict:
    """Static demo data — replace with a real feed (e.g. EthioMarket, FAO GIEWS)."""
    today = date.today().isoformat()
    return {
        "as_of": today,
        "currency": "ETB",
        "unit": "100 kg",
        "items": [
            {"crop": "Teff", "min": 7800, "max": 9200, "trend": "up"},
            {"crop": "Maize", "min": 2900, "max": 3600, "trend": "stable"},
            {"crop": "Sorghum", "min": 3200, "max": 4000, "trend": "down"},
            {"crop": "Wheat", "min": 4100, "max": 4900, "trend": "up"},
            {"crop": "Coffee (parchment)", "min": 32000, "max": 38000, "trend": "up"},
            {"crop": "Sesame", "min": 12500, "max": 15000, "trend": "stable"},
        ],
    }

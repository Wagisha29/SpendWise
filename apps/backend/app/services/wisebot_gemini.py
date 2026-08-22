"""Call Gemini with WiseBot system prompt + user finance context."""

from __future__ import annotations

import json
from typing import Any, Dict

from fastapi import HTTPException, status

from app.core.config import GEMINI_API_KEY, GEMINI_MODEL
from app.services.wisebot_prompt import WISEBOT_SYSTEM_PROMPT


def _build_user_contents(message: str, context: Dict[str, Any]) -> str:
    context_json = json.dumps(context, ensure_ascii=False, separators=(",", ":"))
    return (
        "Answer the user's question using ONLY the financial JSON below.\n\n"
        f"User question:\n{message.strip()}\n\n"
        f"Financial data (JSON):\n{context_json}"
    )


def ask_gemini(message: str, context: Dict[str, Any]) -> str:
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="WiseBot is not configured (missing GEMINI_API_KEY).",
        )

    try:
        from google import genai
        from google.genai import types
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="WiseBot dependency missing. Install google-genai in the backend venv.",
        ) from exc

    client = genai.Client(api_key=GEMINI_API_KEY)

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=_build_user_contents(message, context),
            config=types.GenerateContentConfig(
                system_instruction=WISEBOT_SYSTEM_PROMPT,
                temperature=0.2,
            ),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini request failed: {exc}",
        ) from exc

    text = (response.text or "").strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini returned an empty response.",
        )
    return text

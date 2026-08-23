"""Call Gemini with WiseBot system prompt + user finance context."""

from __future__ import annotations

import json
import re
from typing import Any, Dict, Generator, Iterator

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


def _require_gemini_client():
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

    return genai.Client(api_key=GEMINI_API_KEY), types


def ask_gemini(message: str, context: Dict[str, Any]) -> str:
    client, types = _require_gemini_client()

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


def _chunk_text(chunk: Any) -> str:
    try:
        text = getattr(chunk, "text", None)
        return text or ""
    except Exception:
        return ""


def _iter_words(text: str) -> Iterator[str]:
    """Split text into word-sized pieces (word + trailing whitespace)."""
    for match in re.finditer(r"\S+\s*|\s+", text):
        piece = match.group(0)
        if piece:
            yield piece


def stream_gemini(message: str, context: Dict[str, Any]) -> Iterator[str]:
    """Yield plain text deltas from Gemini as word-sized pieces."""
    client, types = _require_gemini_client()

    try:
        stream = client.models.generate_content_stream(
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

    produced = False
    for chunk in stream:
        delta = _chunk_text(chunk)
        if not delta:
            continue
        for word in _iter_words(delta):
            produced = True
            yield word

    if not produced:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini returned an empty response.",
        )


def sse_event(payload: Dict[str, Any]) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


def iter_wisebot_sse(message: str, context: Dict[str, Any]) -> Generator[str, None, None]:
    """SSE frames: delta chunks, then done / error."""
    try:
        for delta in stream_gemini(message, context):
            yield sse_event({"delta": delta})
        yield sse_event({"done": True})
    except HTTPException as exc:
        detail = exc.detail if isinstance(exc.detail, str) else "WiseBot request failed."
        yield sse_event({"error": detail})
    except Exception as exc:
        yield sse_event({"error": f"Gemini request failed: {exc}"})

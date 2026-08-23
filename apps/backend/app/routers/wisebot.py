from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.database import get_db
from app.schemas.wisebot import WiseBotChatIn, WiseBotChatOut
from app.services.wisebot_context import build_user_finance_context
from app.services.wisebot_gemini import ask_gemini, iter_wisebot_sse

router = APIRouter(prefix="/api/wisebot", tags=["wisebot"])


@router.post("/chat", response_model=WiseBotChatOut)
def chat(
    body: WiseBotChatIn,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    context = build_user_finance_context(db, user.id)
    reply = ask_gemini(body.message, context)
    return WiseBotChatOut(reply=reply)


@router.post("/chat/stream")
def chat_stream(
    body: WiseBotChatIn,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    context = build_user_finance_context(db, user.id)
    return StreamingResponse(
        iter_wisebot_sse(body.message, context),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

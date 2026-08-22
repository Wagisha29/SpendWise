from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.database import get_db
from app.schemas.wisebot import WiseBotChatIn, WiseBotChatOut
from app.services.wisebot_context import build_user_finance_context
from app.services.wisebot_gemini import ask_gemini

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

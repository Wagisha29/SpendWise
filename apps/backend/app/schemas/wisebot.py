from pydantic import BaseModel, Field


class WiseBotChatIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class WiseBotChatOut(BaseModel):
    reply: str

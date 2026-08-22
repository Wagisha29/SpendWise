from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import ALLOWED_ORIGINS
from app.core.database import Base, engine
from app.routers import expenses, income, summary, wisebot

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpendWise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router)
app.include_router(income.router)
app.include_router(summary.router)
app.include_router(wisebot.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
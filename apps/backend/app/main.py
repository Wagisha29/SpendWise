from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import ALLOWED_ORIGINS, GEMINI_API_KEY
from app.core.database import Base, engine
from app.routers import expenses, income, summary, wisebot, filters

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpendWise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    # Vite falls back to the next free port (5174, 5175, ...) whenever 5173 is
    # already taken (e.g. a leftover dev server), which otherwise breaks CORS
    # every time. Allow any localhost/127.0.0.1 port in addition to the
    # explicit ALLOWED_ORIGINS list (which still gates production origins).
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router)
app.include_router(income.router)
app.include_router(summary.router)
app.include_router(wisebot.router)
app.include_router(filters.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        # True only when Render/local env has a non-empty Gemini key (never returns the key).
        "wisebot_configured": bool(GEMINI_API_KEY),
    }
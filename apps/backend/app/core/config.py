import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./spendwise.db")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")

# Gemini (WiseBot) — keep this on the backend only; never expose via VITE_*.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash").strip()

# Comma-separated list of allowed frontend origins, e.g.
# "http://localhost:5173,https://spendwise-io.vercel.app"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,https://spendwise-io.vercel.app",
    ).split(",")
    if origin.strip()
]

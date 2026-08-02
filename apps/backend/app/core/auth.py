from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.core.config import SUPABASE_JWT_SECRET, SUPABASE_URL

bearer_scheme = HTTPBearer(auto_error=False)

# Supabase projects sign session JWTs with an asymmetric key (ES256) by default
# nowadays, verified via this JWKS endpoint. Some older projects may still use
# the legacy shared HS256 secret instead, so we support both.
_JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
_jwk_client = jwt.PyJWKClient(_JWKS_URL, cache_keys=True) if SUPABASE_URL else None


class CurrentUser(BaseModel):
    id: str
    email: Optional[str] = None


def _decode_token(token: str) -> dict:
    errors = []

    if _jwk_client is not None:
        try:
            signing_key = _jwk_client.get_signing_key_from_jwt(token)
            return jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                audience="authenticated",
            )
        except jwt.PyJWTError as exc:
            errors.append(exc)

    if SUPABASE_JWT_SECRET:
        try:
            return jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.PyJWTError as exc:
            errors.append(exc)

    if errors:
        raise errors[-1]
    raise jwt.PyJWTError("No verification method configured (missing SUPABASE_URL/SUPABASE_JWT_SECRET)")


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> CurrentUser:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = _decode_token(credentials.credentials)
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        ) from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    return CurrentUser(id=user_id, email=payload.get("email"))

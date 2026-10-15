from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalOut, GoalUpsert

router = APIRouter(prefix="/api/goals", tags=["goals"])

# Matches "YYYY-MM", e.g. "2026-09".
MONTH_PATTERN = r"^\d{4}-(0[1-9]|1[0-2])$"


def _get_goal(db: Session, user: CurrentUser, month: str) -> Optional[Goal]:
    return db.scalar(
        select(Goal).where(Goal.user_id == user.id, Goal.month == month)
    )


@router.get("/{month}", response_model=GoalOut)
def get_goal(
    month: str = Path(..., pattern=MONTH_PATTERN),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    goal = _get_goal(db, user, month)
    if goal is None:
        raise HTTPException(status_code=404, detail="No goal set for this month")
    return goal


@router.put("/{month}", response_model=GoalOut)
def upsert_goal(
    payload: GoalUpsert,
    month: str = Path(..., pattern=MONTH_PATTERN),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    goal = _get_goal(db, user, month)
    if goal is None:
        goal = Goal(user_id=user.id, month=month, amount=payload.amount)
        db.add(goal)
    else:
        goal.amount = payload.amount
        goal.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{month}", status_code=204)
def delete_goal(
    month: str = Path(..., pattern=MONTH_PATTERN),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    goal = _get_goal(db, user, month)
    if goal is None:
        raise HTTPException(status_code=404, detail="No goal set for this month")
    db.delete(goal)
    db.commit()

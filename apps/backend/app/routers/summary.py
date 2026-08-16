from calendar import monthrange
from datetime import date
from typing import Optional, Tuple

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.database import get_db
from app.models.expense import Expense
from app.models.income import Income
from app.schemas.summary import SummaryOut

router = APIRouter(prefix="/api", tags=["summary"])


def _month_bounds(today: Optional[date] = None) -> Tuple[date, date]:
    today = today or date.today()
    start = date(today.year, today.month, 1)
    end = date(today.year, today.month, monthrange(today.year, today.month)[1])
    return start, end


@router.get("/summary", response_model=SummaryOut)
def get_summary(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    start, end = _month_bounds()
    income_total = db.scalar(
        select(func.coalesce(func.sum(Income.amount), 0.0)).where(
            Income.user_id == user.id,
            Income.date >= start,
            Income.date <= end,
        )
    )
    expense_total = db.scalar(
        select(func.coalesce(func.sum(Expense.amount), 0.0)).where(
            Expense.user_id == user.id,
            Expense.date >= start,
            Expense.date <= end,
        )
    )
    income = float(income_total or 0)
    expense = float(expense_total or 0)
    return SummaryOut(
        income=income,
        expense=expense,
        savings=income - expense,
    )

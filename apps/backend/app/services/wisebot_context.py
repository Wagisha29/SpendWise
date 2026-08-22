"""Build a short JSON-ready summary of one user's finances for WiseBot."""

from calendar import monthrange
from datetime import date
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.income import Income


def _month_bounds(today: Optional[date] = None) -> Tuple[date, date]:
    """Return (first_day, last_day) of the current calendar month."""
    today = today or date.today()
    start = date(today.year, today.month, 1)
    end = date(today.year, today.month, monthrange(today.year, today.month)[1])
    return start, end


def build_user_finance_context(
    db: Session,
    user_id: str,
    *,
    recent_limit: int = 10,
) -> Dict[str, Any]:
    """
    Load this user's income/expenses and return a concise dict
    that you can json.dumps(...) before sending to Gemini.
    """
    start, end = _month_bounds()
    period = f"{start.year:04d}-{start.month:02d}"

    # --- totals for this month ---
    income_total = db.scalar(
        select(func.coalesce(func.sum(Income.amount), 0.0)).where(
            Income.user_id == user_id,
            Income.date >= start,
            Income.date <= end,
        )
    )
    expense_total = db.scalar(
        select(func.coalesce(func.sum(Expense.amount), 0.0)).where(
            Expense.user_id == user_id,
            Expense.date >= start,
            Expense.date <= end,
        )
    )

    income = float(income_total or 0)
    expense = float(expense_total or 0)
    savings = income - expense

    # --- spend grouped by category (this month) ---
    category_rows = db.execute(
        select(Expense.category, func.sum(Expense.amount).label("total"))
        .where(
            Expense.user_id == user_id,
            Expense.date >= start,
            Expense.date <= end,
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
    ).all()

    by_category: List[Dict[str, Any]] = [
        {"category": row.category, "total": round(float(row.total), 2)}
        for row in category_rows
    ]

    # --- recent transactions (newest first, capped) ---
    recent_expense_rows = db.scalars(
        select(Expense)
        .where(Expense.user_id == user_id)
        .order_by(Expense.date.desc(), Expense.id.desc())
        .limit(recent_limit)
    ).all()

    recent_income_rows = db.scalars(
        select(Income)
        .where(Income.user_id == user_id)
        .order_by(Income.date.desc(), Income.id.desc())
        .limit(recent_limit)
    ).all()

    recent_expenses = [
        {
            "title": row.title,
            "amount": round(float(row.amount), 2),
            "category": row.category,
            "date": row.date.isoformat(),
        }
        for row in recent_expense_rows
    ]

    recent_income = [
        {
            "source": row.source,
            "amount": round(float(row.amount), 2),
            "date": row.date.isoformat(),
        }
        for row in recent_income_rows
    ]

    return {
        "currency": "INR",
        "period": period,
        "totals": {
            "income": round(income, 2),
            "expense": round(expense, 2),
            "savings": round(savings, 2),
        },
        "by_category": by_category,
        "recent_expenses": recent_expenses,
        "recent_income": recent_income,
    }

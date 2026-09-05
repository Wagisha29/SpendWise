from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.database import get_db
from app.models.expense import Expense
from app.models.income import Income
from app.schemas.filters import ExpenseFilterItem, FilterListOut, IncomeFilterItem

router = APIRouter(prefix="/api/filters", tags=["filters"])


def _expense_conditions(
    user_id: str,
    *,
    category: Optional[str],
    date_from: Optional[date],
    date_to: Optional[date],
    min_amount: Optional[float],
    max_amount: Optional[float],
    q: Optional[str],
):
    conditions = [Expense.user_id == user_id]

    if category:
        conditions.append(Expense.category == category)

    if date_from:
        conditions.append(Expense.date >= date_from)

    if date_to:
        conditions.append(Expense.date <= date_to)

    if min_amount is not None:
        conditions.append(Expense.amount >= min_amount)

    if max_amount is not None:
        conditions.append(Expense.amount <= max_amount)

    if q:
        conditions.append(Expense.title.ilike(f"%{q.strip()}%"))

    return and_(*conditions)


def _income_conditions(
    user_id: str,
    *,
    date_from: Optional[date],
    date_to: Optional[date],
    min_amount: Optional[float],
    max_amount: Optional[float],
    q: Optional[str],
):
    conditions = [Income.user_id == user_id]

    if date_from:
        conditions.append(Income.date >= date_from)

    if date_to:
        conditions.append(Income.date <= date_to)

    if min_amount is not None:
        conditions.append(Income.amount >= min_amount)

    if max_amount is not None:
        conditions.append(Income.amount <= max_amount)

    if q:
        conditions.append(Income.source.ilike(f"%{q.strip()}%"))

    return and_(*conditions)


@router.get("", response_model=FilterListOut)
def list_filters(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
    type: str = Query("all", pattern="^(all|income|expense)$"),
    category: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    min_amount: Optional[float] = Query(None, ge=0),
    max_amount: Optional[float] = Query(None, ge=0),
    q: Optional[str] = Query(None, max_length=100),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    if date_from and date_to and date_from > date_to:
        raise HTTPException(status_code=400, detail="date_from cannot be after date_to")

    if (
        min_amount is not None
        and max_amount is not None
        and min_amount > max_amount
    ):
        raise HTTPException(
            status_code=400,
            detail="min_amount cannot be greater than max_amount",
        )

    if type == "income":
        category = None

    rows: list[tuple[str, object]] = []

    if type in ("all", "expense"):
        exp_where = _expense_conditions(
            user.id,
            category=category,
            date_from=date_from,
            date_to=date_to,
            min_amount=min_amount,
            max_amount=max_amount,
            q=q,
        )
        expenses = db.scalars(select(Expense).where(exp_where)).all()
        for row in expenses:
            rows.append(("expense", row))

    if type in ("all", "income"):
        inc_where = _income_conditions(
            user.id,
            date_from=date_from,
            date_to=date_to,
            min_amount=min_amount,
            max_amount=max_amount,
            q=q,
        )
        incomes = db.scalars(select(Income).where(inc_where)).all()
        for row in incomes:
            rows.append(("income", row))

    rows.sort(key=lambda item: (item[1].date, item[1].id), reverse=True)

    total = len(rows)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    offset = (page - 1) * page_size
    page_rows = rows[offset : offset + page_size]

    items = []
    for kind, row in page_rows:
        if kind == "expense":
            items.append(ExpenseFilterItem(data=row))
        else:
            items.append(IncomeFilterItem(data=row))

    return FilterListOut(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )

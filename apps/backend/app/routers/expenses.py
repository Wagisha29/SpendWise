from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.database import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseOut, ExpenseUpdate

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)
):
    return db.scalars(
        select(Expense)
        .where(Expense.user_id == user.id)
        .order_by(Expense.date.desc(), Expense.id.desc())
    ).all()


@router.post("", response_model=ExpenseOut, status_code=201)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    data = expense.model_dump()
    quantity = data.pop("quantity")
    data["amount"] = data["amount"] * quantity
    db_expense = Expense(**data, user_id=user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def _get_owned_expense(db: Session, expense_id: int, user: CurrentUser) -> Expense:
    expense = db.get(Expense, expense_id)
    if expense is None or expense.user_id != user.id:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.get("/{expense_id}", response_model=ExpenseOut)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    return _get_owned_expense(db, expense_id, user)


@router.patch("/{expense_id}", response_model=ExpenseOut)
def update_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    db_expense = _get_owned_expense(db, expense_id, user)
    data = expense.model_dump(exclude_unset=True)
    quantity = data.pop("quantity", None)
    if "amount" in data and quantity is not None:
        data["amount"] = data["amount"] * quantity
    elif quantity is not None and "amount" not in data:
        raise HTTPException(
            status_code=400, detail="Send amount (unit price) with quantity"
        )
    for field, value in data.items():
        setattr(db_expense, field, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.delete("/{expense_id}", status_code=204)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    db_expense = _get_owned_expense(db, expense_id, user)
    db.delete(db_expense)
    db.commit()

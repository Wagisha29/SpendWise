from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.database import get_db
from app.models.income import Income
from app.schemas.income import IncomeCreate, IncomeOut, IncomeUpdate

router = APIRouter(prefix="/api/income", tags=["income"])


@router.get("", response_model=list[IncomeOut])
def list_income(
    db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)
):
    return db.scalars(
        select(Income)
        .where(Income.user_id == user.id)
        .order_by(Income.date.desc(), Income.id.desc())
    ).all()


@router.post("", response_model=IncomeOut, status_code=201)
def create_income(
    income: IncomeCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    db_income = Income(**income.model_dump(), user_id=user.id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income


def _get_owned_income(db: Session, income_id: int, user: CurrentUser) -> Income:
    income = db.get(Income, income_id)
    if income is None or income.user_id != user.id:
        raise HTTPException(status_code=404, detail="Income not found")
    return income


@router.get("/{income_id}", response_model=IncomeOut)
def get_income(
    income_id: int,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    return _get_owned_income(db, income_id, user)


@router.patch("/{income_id}", response_model=IncomeOut)
def update_income(
    income_id: int,
    income: IncomeUpdate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    db_income = _get_owned_income(db, income_id, user)
    for field, value in income.model_dump(exclude_unset=True).items():
        setattr(db_income, field, value)
    db.commit()
    db.refresh(db_income)
    return db_income


@router.delete("/{income_id}", status_code=204)
def delete_income(
    income_id: int,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    db_income = _get_owned_income(db, income_id, user)
    db.delete(db_income)
    db.commit()

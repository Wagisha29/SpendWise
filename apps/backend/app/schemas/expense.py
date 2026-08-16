from datetime import date as date_type
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ExpenseBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    amount: float = Field(gt=0)
    category: str = Field(default="Others", max_length=100)
    date: date_type = Field(default_factory=date_type.today)


class ExpenseCreate(ExpenseBase):
    # Input-only: unit price is `amount`; total stored = amount * quantity
    quantity: float = Field(default=1, gt=0)


class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    quantity: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = Field(default=None, max_length=100)
    date: Optional[date_type] = None


class ExpenseOut(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

class ExpenseListOut(BaseModel):
    items: list[ExpenseOut]
    page: int
    page_size: int
    total: int
    total_pages: int
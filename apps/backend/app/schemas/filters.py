from typing import Literal, Union

from pydantic import BaseModel
from app.schemas.expense import ExpenseOut
from app.schemas.income import IncomeOut

class IncomeFilterItem(BaseModel):
    kind: Literal["income"] = "income"
    data: IncomeOut

class ExpenseFilterItem(BaseModel):
    kind: Literal["expense"] = "expense"
    data: ExpenseOut

FilterItem = Union[IncomeFilterItem, ExpenseFilterItem]

class FilterListOut(BaseModel):
    items: list[FilterItem]
    page: int
    page_size: int
    total: int
    total_pages: int
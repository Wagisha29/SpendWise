from datetime import date as date_type
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class IncomeBase(BaseModel):
    source: str = Field(min_length=1, max_length=255)
    amount: float = Field(gt=0)
    date: date_type = Field(default_factory=date_type.today)


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(BaseModel):
    source: Optional[str] = Field(default=None, min_length=1, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    date: Optional[date_type] = None


class IncomeOut(IncomeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

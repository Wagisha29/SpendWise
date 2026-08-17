from pydantic import BaseModel


class SummaryOut(BaseModel):
    income: float
    expense: float
    savings: float

    
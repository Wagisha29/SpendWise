from pydantic import BaseModel, ConfigDict, Field


class GoalBase(BaseModel):
    month: str = Field(min_length=7, max_length=10)
    amount: float = Field(gt=0)


class GoalUpsert(BaseModel):
    # `month` is taken from the URL path, so the body only needs the amount.
    amount: float = Field(gt=0)


class GoalOut(GoalBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

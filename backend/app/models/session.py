from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class Session(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    avg_time_per_problem: float | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    correct: int 
    incorrect: int 
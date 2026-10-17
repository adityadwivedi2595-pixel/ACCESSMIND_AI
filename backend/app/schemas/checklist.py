from pydantic import BaseModel
from uuid import UUID

class ChecklistTaskBase(BaseModel):
    session_id: UUID
    scheme_id: int
    task_text: str
    is_completed: bool = False

class ChecklistTaskCreate(ChecklistTaskBase):
    pass

class ChecklistTaskUpdate(BaseModel):
    is_completed: bool

class ChecklistTask(ChecklistTaskBase):
    id: int

    class Config:
        from_attributes = True

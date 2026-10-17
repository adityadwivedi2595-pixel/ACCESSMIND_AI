from pydantic import BaseModel

class ChecklistTaskBase(BaseModel):
    session_id: str
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

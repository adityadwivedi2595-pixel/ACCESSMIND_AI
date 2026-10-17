from pydantic import BaseModel
from uuid import UUID

class SavedSchemeBase(BaseModel):
    session_id: UUID
    scheme_id: int

class SavedSchemeCreate(SavedSchemeBase):
    pass

class SavedScheme(SavedSchemeBase):
    id: int
    
    class Config:
        from_attributes = True

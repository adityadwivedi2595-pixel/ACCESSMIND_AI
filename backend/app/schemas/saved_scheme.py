from pydantic import BaseModel
from app.schemas.scheme import Scheme

class SavedSchemeBase(BaseModel):
    session_id: str
    scheme_id: int

class SavedSchemeCreate(SavedSchemeBase):
    pass

class SavedScheme(SavedSchemeBase):
    id: int
    
    class Config:
        from_attributes = True

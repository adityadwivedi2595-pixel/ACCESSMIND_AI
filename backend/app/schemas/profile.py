from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    category: Optional[str] = None
    age: Optional[int] = None
    state: Optional[str] = None
    district: Optional[str] = None
    education_level: Optional[str] = None
    student_status: Optional[str] = None
    employment_status: Optional[str] = None
    income: Optional[float] = None
    occupation: Optional[str] = None

class ProfileCreate(ProfileBase):
    session_id: str

class ProfileUpdate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: Optional[int] = None
    session_id: str

    class Config:
        from_attributes = True

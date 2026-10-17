from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class SchemeBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    benefits: Optional[str] = None
    documents_required: Optional[str] = None
    application_procedure: Optional[str] = None
    source_url: Optional[str] = None
    last_verified: Optional[str] = None
    criteria: List[Dict[str, Any]] = []

class SchemeCreate(SchemeBase):
    pass

class Scheme(SchemeBase):
    id: int

    class Config:
        from_attributes = True

class EligibilityResult(BaseModel):
    scheme: Scheme
    status: str # "potential_match", "does_not_match", "insufficient_information"
    is_eligible: Optional[bool] = None
    reason: Optional[str] = None
    satisfied_criteria: List[str] = []
    unsatisfied_criteria: List[str] = []
    unknown_criteria: List[str] = []
    missing_fields: List[str] = []
    explanation: str

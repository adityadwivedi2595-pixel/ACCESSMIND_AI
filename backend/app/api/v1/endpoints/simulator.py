from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.scheme import Scheme as SchemeModel
from app.schemas.scheme import Scheme, EligibilityResult
from app.schemas.profile import ProfileBase
from app.schemas.profile import Profile as ProfileSchema
from app.eligibility.engine import evaluate_eligibility

router = APIRouter()

@router.post("/", response_model=List[dict])
def simulate_eligibility(
    profile_in: ProfileBase, 
    scheme_ids: List[int],
    db: Session = Depends(get_db)
):
    results = []
    
    # We use a dummy session_id since it's just simulation
    profile_schema = ProfileSchema(**profile_in.model_dump(), id=0, session_id="simulation")
    
    schemes = db.query(SchemeModel).filter(SchemeModel.id.in_(scheme_ids)).all()
    
    for scheme_model in schemes:
        scheme_schema = Scheme.model_validate(scheme_model)
        result = evaluate_eligibility(scheme_schema, profile_schema)
        results.append(result.model_dump())
        
    return results

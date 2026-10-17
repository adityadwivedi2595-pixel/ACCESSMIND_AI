from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.db.session import get_db
from app.models.scheme import Scheme as SchemeModel
from app.schemas.scheme import Scheme
from app.schemas.profile import Profile as ProfileSchema
from app.models.profile import Profile as ProfileModel
from app.eligibility.engine import evaluate_eligibility

router = APIRouter()

@router.get("/", response_model=List[Scheme])
def get_schemes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    q: Optional[str] = None
):
    query = db.query(SchemeModel)
    if category:
        query = query.filter(SchemeModel.category == category)
    if q:
        query = query.filter(SchemeModel.name.contains(q) | SchemeModel.description.contains(q))
    schemes = query.offset(skip).limit(limit).all()
    return schemes

@router.get("/{scheme_id}", response_model=Scheme)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme

@router.get("/{scheme_id}/evaluate", response_model=dict)
def evaluate_scheme(scheme_id: int, session_id: UUID, db: Session = Depends(get_db)):
    scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
        
    session_id = str(session_id)
    profile = db.query(ProfileModel).filter(ProfileModel.session_id == session_id).first()
    
    scheme_schema = Scheme.model_validate(scheme)
    if profile:
        profile_schema = ProfileSchema.model_validate(profile)
    else:
        profile_schema = ProfileSchema(id=0, session_id=session_id)
        
    result = evaluate_eligibility(scheme_schema, profile_schema)
    return result.model_dump()

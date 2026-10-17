from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.session import get_db
from app.models.profile import Profile as ProfileModel
from app.schemas.profile import Profile, ProfileCreate, ProfileUpdate

router = APIRouter()

@router.post("/", response_model=Profile)
def create_profile(profile_in: ProfileCreate, db: Session = Depends(get_db)):
    session_id = str(profile_in.session_id)
    db_profile = db.query(ProfileModel).filter(ProfileModel.session_id == session_id).first()
    profile_data = profile_in.model_dump(mode="json")
    if db_profile:
        for key, value in profile_data.items():
            setattr(db_profile, key, value)
    else:
        db_profile = ProfileModel(**profile_data)
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/{session_id}", response_model=Profile)
def get_profile(session_id: UUID, db: Session = Depends(get_db)):
    session_id = str(session_id)
    profile = db.query(ProfileModel).filter(ProfileModel.session_id == session_id).first()
    if not profile:
        return Profile(session_id=session_id)
    return profile

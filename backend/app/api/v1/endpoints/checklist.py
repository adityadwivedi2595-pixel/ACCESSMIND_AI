from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.db.session import get_db
from app.models.saved_scheme import SavedScheme as SavedSchemeModel
from app.models.checklist import ChecklistTask as ChecklistTaskModel
from app.schemas.saved_scheme import SavedScheme, SavedSchemeCreate
from app.schemas.checklist import ChecklistTask, ChecklistTaskCreate, ChecklistTaskUpdate

router = APIRouter()

# Saved Schemes
@router.post("/saved", response_model=SavedScheme)
def save_scheme(saved_in: SavedSchemeCreate, db: Session = Depends(get_db)):
    db_obj = SavedSchemeModel(**saved_in.model_dump(mode="json"))
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/saved/{session_id}", response_model=List[SavedScheme])
def get_saved_schemes(session_id: UUID, db: Session = Depends(get_db)):
    return db.query(SavedSchemeModel).filter(SavedSchemeModel.session_id == str(session_id)).all()

@router.delete("/saved/{saved_id}")
def delete_saved_scheme(saved_id: int, session_id: UUID, db: Session = Depends(get_db)):
    db_obj = db.query(SavedSchemeModel).filter(
        SavedSchemeModel.id == saved_id,
        SavedSchemeModel.session_id == str(session_id),
    ).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Saved scheme not found")
    db.delete(db_obj)
    db.commit()
    return {"status": "deleted"}

# Checklist Tasks
@router.post("/tasks", response_model=ChecklistTask)
def create_task(task_in: ChecklistTaskCreate, db: Session = Depends(get_db)):
    db_obj = ChecklistTaskModel(**task_in.model_dump(mode="json"))
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/tasks/{session_id}", response_model=List[ChecklistTask])
def get_tasks(session_id: UUID, scheme_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(ChecklistTaskModel).filter(ChecklistTaskModel.session_id == str(session_id))
    if scheme_id:
        query = query.filter(ChecklistTaskModel.scheme_id == scheme_id)
    return query.all()

@router.put("/tasks/{task_id}", response_model=ChecklistTask)
def update_task(task_id: int, task_in: ChecklistTaskUpdate, session_id: UUID, db: Session = Depends(get_db)):
    db_obj = db.query(ChecklistTaskModel).filter(
        ChecklistTaskModel.id == task_id,
        ChecklistTaskModel.session_id == str(session_id),
    ).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Task not found")
    db_obj.is_completed = task_in.is_completed
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, session_id: UUID, db: Session = Depends(get_db)):
    db_obj = db.query(ChecklistTaskModel).filter(
        ChecklistTaskModel.id == task_id,
        ChecklistTaskModel.session_id == str(session_id),
    ).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Checklist task not found")
    db.delete(db_obj)
    db.commit()
    return {"status": "deleted"}

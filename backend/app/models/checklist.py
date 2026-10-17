from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db.session import Base

class ChecklistTask(Base):
    __tablename__ = "checklist_tasks"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"))
    task_text = Column(String)
    is_completed = Column(Boolean, default=False)

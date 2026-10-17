from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class SavedScheme(Base):
    __tablename__ = "saved_schemes"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"))

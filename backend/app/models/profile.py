from sqlalchemy import Column, Integer, String, Float
from app.db.session import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, unique=True)
    name = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    category = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    education_level = Column(String, nullable=True)
    student_status = Column(String, nullable=True)
    employment_status = Column(String, nullable=True)
    income = Column(Float, nullable=True)
    occupation = Column(String, nullable=True)

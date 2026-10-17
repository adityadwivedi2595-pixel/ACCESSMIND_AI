from sqlalchemy import Column, Integer, String, Text, JSON
from app.db.session import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    description = Column(Text)
    benefits = Column(Text)
    documents_required = Column(Text)
    application_procedure = Column(Text)
    source_url = Column(String)
    last_verified = Column(String)
    
    # Store criteria as JSON
    criteria = Column(JSON, default=list)

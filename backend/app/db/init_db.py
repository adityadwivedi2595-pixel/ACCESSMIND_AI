from app.db.session import engine, Base
from app.models import scheme, profile, saved_scheme, checklist

def init_db():
    Base.metadata.create_all(bind=engine)

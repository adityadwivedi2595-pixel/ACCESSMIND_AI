from app.db.session import engine, Base
from app.models import scheme, profile, saved_scheme, checklist
from app.seed.seed_data import seed_db

def init_db():
    Base.metadata.create_all(bind=engine)
    seed_db()

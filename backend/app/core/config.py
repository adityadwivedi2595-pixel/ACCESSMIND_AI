from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ACCESSMIND AI"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./accessmind.db"

    class Config:
        env_file = ".env"

settings = Settings()

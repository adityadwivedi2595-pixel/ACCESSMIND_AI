from fastapi import APIRouter
from app.api.v1.endpoints import schemes, profiles, simulator, assistant, checklist

api_router = APIRouter()
api_router.include_router(schemes.router, prefix="/schemes", tags=["schemes"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(simulator.router, prefix="/simulator", tags=["simulator"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["assistant"])
api_router.include_router(checklist.router, prefix="/checklist", tags=["checklist"])

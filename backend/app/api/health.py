# app/api/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/", tags=["Health"])
def health_check():
    return {"status": "ok"}

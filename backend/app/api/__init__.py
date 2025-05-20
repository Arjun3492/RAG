# app/api/__init__.py
from fastapi import APIRouter
from app.api import upload, documents, ask,health

router = APIRouter()
router.include_router(upload.router, prefix="/upload-documents", tags=["Upload"])
router.include_router(documents.router, prefix="/documents", tags=["Documents"])
router.include_router(ask.router, prefix="/ask", tags=["Query"])
router.include_router(health.router, prefix="/health", tags=["Health"])


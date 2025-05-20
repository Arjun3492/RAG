# app/api/upload.py
from fastapi import APIRouter, UploadFile, File
from typing import List
from app.services.document_processor import process_documents
from app.config import settings

router = APIRouter()

@router.post("/")
async def upload_documents(files: List[UploadFile] = File(...)):
    saved_docs = process_documents(files, settings.CHROMA_PERSIST_DIR)
    return {"uploaded": saved_docs}

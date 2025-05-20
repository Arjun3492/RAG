# app/api/documents.py
from fastapi import APIRouter, HTTPException,Path
from app.models.database import SessionLocal
from app.models.models import Document
from app.config import settings
from langchain.vectorstores import Chroma
# from langchain.embeddings import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings


router = APIRouter()

@router.get("/")
def list_documents():
    db = SessionLocal()
    docs = db.query(Document).all()
    db.close()
    return [
        {
            "id": doc.id,
            "name": doc.name,
            "file_type": doc.file_type,
            "upload_time": doc.upload_time.isoformat()
        }
        for doc in docs
    ]


@router.delete("/{doc_id}")
def delete_document(doc_id: str = Path(...)):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        db.close()
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete from ChromaDB
    # embedding = OpenAIEmbeddings(model=settings.EMBEDDING_MODEL,    openai_api_key=settings.OPENAI_API_KEY )
    embedding = GoogleGenerativeAIEmbeddings(model=settings.EMBEDDING_MODEL,google_api_key=settings.GOOGLE_API_KEY )
    vectordb = Chroma(persist_directory=settings.CHROMA_PERSIST_DIR, embedding_function=embedding)

    # Filtering by metadata "document_id"
    vectordb._collection.delete(where={"document_id": doc_id})
    vectordb.persist()

    # Delete from DB (cascades to chunks)
    db.delete(doc)
    db.commit()
    db.close()
    return {"status": "deleted", "document_id": doc_id}
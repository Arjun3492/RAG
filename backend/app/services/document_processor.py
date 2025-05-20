# app/services/document_processor.py
import os
import pytesseract
from PIL import Image
from pdfminer.high_level import extract_text
from app.models.models import Document, Chunk
from app.models.database import SessionLocal
from app.services.embedding_service import embed_chunks
from app.services.chunking import split_text
import uuid
from datetime import datetime

def extract_text_from_image(file_path: str) -> str:
    image = Image.open(file_path)
    return pytesseract.image_to_string(image)

def extract_text_from_pdf(file_path: str) -> str:
    return extract_text(file_path)

def process_documents(files: list, persist_dir: str):
    db = SessionLocal()
    saved_documents = []

    for file in files:
        filename = file.filename
        file_ext = os.path.splitext(filename)[1].lower()
        file_type = "image" if file_ext in [".png", ".jpg", ".jpeg"] else "pdf"

        doc_id = str(uuid.uuid4())
        file_path = f"/tmp/{doc_id}_{filename}"

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        # Extract text
        if file_type == "image":
            text = extract_text_from_image(file_path)
        else:
            text = extract_text_from_pdf(file_path)

        # Chunk the text
        chunks = split_text(text)

        # Embed and store in Chroma
        embedding_ids = embed_chunks(chunks, doc_id, persist_dir)

        # Create Document and Chunk DB entries
        document = Document(
            id=doc_id,
            name=filename,
            file_type=file_type,
            upload_time=datetime.utcnow(),
        )
        db.add(document)

        for i, chunk_text in enumerate(chunks):
            chunk = Chunk(
                id=str(uuid.uuid4()),
                document_id=doc_id,
                content=chunk_text,
                page_number=None,        # (optional: enhance later)
                line_number=None,        # (optional: enhance later)
                embedding_id=embedding_ids[i],
                created_at=datetime.utcnow(),
            )
            db.add(chunk)

        db.commit()
        saved_documents.append({"id": doc_id, "name": filename})

        os.remove(file_path)

    db.close()
    return saved_documents

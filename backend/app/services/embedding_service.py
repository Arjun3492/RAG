# app/services/embedding_service.py
from langchain.vectorstores import Chroma
# from langchain.embeddings import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings

# embedding_model = OpenAIEmbeddings(model=settings.EMBEDDING_MODEL,    openai_api_key=settings.OPENAI_API_KEY )
embedding_model=GoogleGenerativeAIEmbeddings(model=settings.EMBEDDING_MODEL,google_api_key=settings.GOOGLE_API_KEY )
def embed_chunks(chunks: list[str], doc_id: str, persist_dir: str) -> list[str]:
    metadatas = [{"document_id": doc_id, "chunk_index": i} for i in range(len(chunks))]
    vectordb = Chroma(
        persist_directory=persist_dir,
        embedding_function=embedding_model
    )
    vectordb.add_texts(chunks, metadatas=metadatas)
    vectordb.persist()

    # Return mock embedding IDs (Chroma doesn’t expose this directly)
    return [f"{doc_id}-{i}" for i in range(len(chunks))]

# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    EMBEDDING_MODEL: str = "models/embedding-001"
    LLM_MODEL: str = "gemini-2.0-flash"
    CHROMA_PERSIST_DIR: str = "./chroma_store"
    SQLITE_DB_PATH: str = "./app/app.db"
    GOOGLE_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()

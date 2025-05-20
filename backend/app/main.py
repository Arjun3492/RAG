# app/main.py
from fastapi import FastAPI
from app.api import router as api_router
from app.models.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Document Intelligence API",
    version="1.0.0"
)

origins = [
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allows specific origins
    allow_credentials=True,
    allow_methods=["*"],    # allow all methods (GET, POST, etc)
    allow_headers=["*"],    # allow all headers
)
Base.metadata.create_all(bind=engine)


app.include_router(api_router)


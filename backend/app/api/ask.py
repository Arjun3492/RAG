# app/api/ask.py
from fastapi import APIRouter, Body
from pydantic import BaseModel
from app.services.query_engine import process_question

router = APIRouter()

class AskRequest(BaseModel):
    question: str

@router.post("/")
async def ask_question(req: AskRequest):
    return process_question(req.question)

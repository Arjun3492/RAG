from app.config import settings
from langchain.vectorstores import Chroma
# from langchain.embeddings import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain.chat_models import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import Document as LCDocument
from app.models.database import SessionLocal
from app.models.models import Document
from collections import defaultdict
import json

# embedding = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY,model=settings.EMBEDDING_MODEL)
embedding = GoogleGenerativeAIEmbeddings(google_api_key=settings.GOOGLE_API_KEY, model=settings.EMBEDDING_MODEL)
# llm = ChatOpenAI(model=settings.LLM_MODEL, temperature=0,openai_api_key=settings.OPENAI_API_KEY)
llm = ChatGoogleGenerativeAI(model=settings.LLM_MODEL, temperature=0, google_api_key=settings.GOOGLE_API_KEY)
vectordb = Chroma(persist_directory=settings.CHROMA_PERSIST_DIR, embedding_function=embedding)

def process_question(question: str):
    docs: list[LCDocument] = vectordb.similarity_search(question, k=10)

    if not docs:
        return {
            "document_responses": [],
            "final_summary": [],
            "message": "No relevant documents found."
        }

    db = SessionLocal()
    grouped_by_doc = defaultdict(list)
    document_map = {}

    for doc in docs:
        doc_id = doc.metadata.get("document_id", "unknown")
        grouped_by_doc[doc_id].append(doc)
        if doc_id not in document_map:
            db_doc = db.query(Document).filter(Document.id == doc_id).first()
            document_map[doc_id] = db_doc.name if db_doc else "Unknown"

    db.close()

    document_responses = []
    extracted_chunks = []

    for doc_id, doc_chunks in grouped_by_doc.items():
        combined_text = "\n".join([c.page_content for c in doc_chunks])
        answer, citation = extract_answer_and_citation(combined_text, question)
        if answer:
            extracted_chunks.append({
                "doc_id": doc_id,
                "text": answer
            })

            document_responses.append({
            "document_id": doc_id,
            "extracted_answer": answer,
            "citation": citation
            })

        # document_responses.append({
        #     "document_id": doc_id,
        #     "extracted_answer": answer,
        #     "citation": citation
        # })

        # extracted_chunks.append({
        #     "doc_id": doc_id,
        #     "text": answer
        # })

    final_summary = synthesize_themes(extracted_chunks, question)

    return {
        "document_responses": document_responses,
        "final_summary": final_summary
    }


def extract_answer_and_citation(text: str, question: str):
    prompt = f"""
    Given the following text from a document, extract the most relevant answer to the user's question. Also identify the most likely citation (e.g., 'Page 2, Para 1') if available.

    If the text does not contain any relevant information, respond with:
    Answer: None
    Citation: None

    ---
    Question: {question}

    Document Text:
    {text}
    ---

    Respond in the following format:
    Answer: <extracted answer or None>
    Citation: <page and para, if known or approximated or None>
    """

    response = llm.invoke(prompt)
    lines = response.content.strip().splitlines()

    answer, citation = None, None
    for line in lines:
        if line.lower().startswith("answer:"):
            val = line.split(":", 1)[1].strip()
            answer = val if val.lower() != "none" else None
        elif line.lower().startswith("citation:"):
            val = line.split(":", 1)[1].strip()
            citation = val if val.lower() != "none" else None

    # Return None if no relevant answer found
    if not answer:
        return None, None

    return answer, citation


def synthesize_themes(extracted_chunks: list[dict], question: str):
    source_texts = "\n".join(
        f"[{chunk['doc_id']}] {chunk['text']}" for chunk in extracted_chunks
    )

    prompt = f"""
            You are to synthesize themes from multiple document answers. Use the following rules:

            1. Identify meaningful themes from the content that are relevant to the user's question.
            2. Group document IDs under each theme.
            3. Provide a short summary per theme.
            4. Format the output as a JSON list like this:

            [
            {{
                "theme": "<theme title>",
                "summary": "<summary with document IDs cited like (DOC001, DOC002)>"
            }},
            ...
            ]

            ---
            Question: {question}

            Document Answers:
            {source_texts}
            """

    response = llm.invoke(prompt)

    try:
        cleaned = response.content.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(cleaned)
    except Exception:
        return [{"theme": "Uncategorized", "summary": response.content.strip()}]

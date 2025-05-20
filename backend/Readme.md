
## 🚀 How to Start the Service

python3 -m venv venv
source venv/bin/activate
uvicorn app.main:app --reload



### 1. Setup `.env`

Create a `.env` file with your OpenAI key and model preferences:

```env
LLM_MODEL=preferred_gemini_model
CHROMA_PERSIST_DIR=/app/chroma_store
GOOGLE_API_KEY=your_google_api_key
```

### 2. Build and Run with Docker

```bash
docker-compose build
docker-compose up
```

The API will be available at: [http://localhost:8000](http://localhost:8000)

Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ⚙️ How It Works

1. **Upload Documents**

   * PDF: Extracts text page by page
   * Image: Extracts text using `pytesseract` OCR

2. **Text Chunking & Embedding**

   * Text is split into manageable chunks
   * Each chunk is embedded using OpenAI's `text-embedding-3-small` model
   * Chunks and metadata (source file, page, line number) are stored in **ChromaDB**

3. **Storage**

   * Embeddings are stored persistently in `chroma_store/`
   * Document metadata is stored in a local SQLite DB

4. **Querying**

   * When a question is asked, the system retrieves relevant chunks via vector search
   * It uses OpenAI's LLM to:

     * Extract document-level answers
     * Group insights into **themes**
     * Generate structured response with **citations**

5. **Response Format**

   * Returns both:

     * A table of per-document answers + citations
     * A synthesized answer grouped by themes

---

## 📬 API Endpoints

### 📤 `POST /upload-documents`

Upload one or more PDF/image files.

**Body**: `multipart/form-data` with files
**Returns**: JSON list of document IDs and metadata

---

### 📜 `GET /documents`

Returns a list of all uploaded documents with their metadata.

---

### ❌ `DELETE /documents/{id}`

Deletes a specific document from the vector store and metadata DB.

---

### ❓ `POST /ask`

Submit a query across all stored documents.

**Body**:

```json
{
  "question": "What penalties were imposed for non-compliance?"
}
```

**Response**:

```json
{
  "document_responses": [
    {
      "document_id": "DOC001",
      "extracted_answer": "...",
      "citation": "Page 4, Para 2"
    }
  ],
  "final_summary": [
    {
      "theme": "Regulatory Non-Compliance",
      "summary": "Documents (DOC001) highlight issues under SEBI Act."
    }
  ]
}
```

---

## 📁 Project Structure

```
app/
├── api/           # FastAPI routes
├── core/          # OCR, parsing, and embedding logic
├── models/        # SQLAlchemy DB models
├── services/      # Vector store, query engine, theme synthesis
├── config.py      # Env and settings
└── main.py        # App entry point

chroma_store/      # Persistent Chroma vector DB
Dockerfile
docker-compose.yml
.env
requirements.txt
```

---

## 🛠 Tech Stack

* **FastAPI** – RESTful backend
* **LangChain** – Chunking, vector utilities
* **OpenAI** – Embeddings + LLM
* **ChromaDB** – Vector store (local, persistent)
* **SQLite** – Metadata DB
* **Pytesseract** – OCR for images
* **Docker** – Containerized setup

---

## 🧼 Reset the Vector Store (optional)

```bash
rm -rf chroma_store/
```

Then re-upload documents.

---

## 🧪 Example Usage

### 📁 1. Upload Sample Documents

Use the following sample test pack for local testing:

🔗[ Sample Documents](./sample_documents.zip)

Unzip the file to access:

* `doc_sebi_order.pdf`
* `doc_circular_guidance.pdf`
* `doc_tribunal_ruling.png`

Upload these using the `/upload-documents` API:

**POST** `/upload-documents`
**Body (form-data):**

```
files: [doc_sebi_order.pdf, doc_circular_guidance.pdf, doc_tribunal_ruling.png]
```

You can use Postman or `curl`:

```bash
curl -X POST http://localhost:8000/upload-documents \
  -F "files=@doc_sebi_order.pdf" \
  -F "files=@doc_circular_guidance.pdf" \
  -F "files=@doc_tribunal_ruling.png"
```

---

### 💬 2. Ask Sample Questions

Use the `/ask` endpoint to query the documents:

**POST** `/ask`
**Body (JSON):**

```json
{
  "question": "What compliance issues are highlighted in the uploaded documents?"
}
```

#### Suggested Questions to Try

1. **Compliance Violations**

   * *"What compliance issues are highlighted in the uploaded documents?"*

2. **Legal References**

   * *"Which legal sections or clauses are referenced in the rulings?"*

3. **Penalty Details**

   * *"What penalties have been imposed, and under what legal authority?"*
   * *"Is there justification provided for the penalties in any of the documents?"*

4. **Disclosure Issues**

   * *"Are there any mentions of delayed disclosures or reporting violations?"*

5. **Circulars**

   * *"Do the documents include any circulars or compliance guidelines?"*

6. **Summary & Themes**

   * *"Summarize all key themes covered in the documents."*
   * *"Group the findings by regulatory area (e.g., disclosure, penalties, enforcement)."*

---



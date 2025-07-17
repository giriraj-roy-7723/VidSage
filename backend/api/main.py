from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import FileResponse
from backend.downloader import download_video
from backend.extractor import extract_and_transcribe
from backend.rag.vectorstore import LanceDBVectorStore
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from dotenv import load_dotenv
import uuid
import os

# Load environment variables
load_dotenv()
genai.configure(api_key="AIzaSyCKZT_t8wa0lIqFPvnD6FaYB0b13a9d6K4")  
model = genai.GenerativeModel("gemini-2.0-flash")

# FastAPI instance
app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "VidSage API is running"}


# ---------------------------
# VIDEO DOWNLOAD
# ---------------------------
class VideoInput(BaseModel):
    video_url: str


@app.post("/process-video")
def process_video(input_data: VideoInput):
    result = download_video(input_data.video_url)

    if result["status"] == "error":
        return {"status": "failed", "error": result["message"]}
    
    return {
        "status": "video downloaded",
        "video_path": result["filepath"],
        "metadata": {
            "title": result["title"],
            "author": result["author"],
            "views": result["views"]
        }
    }


# ---------------------------
# AUDIO & TRANSCRIPTION
# ---------------------------
@app.post("/transcribe")
def transcribe_video():
    video_path = os.path.join("backend", "data", "video_data", "input_vid.mp4")

    if not os.path.exists(video_path):
        return {"status": "failed", "error": "Video file not found."}

    result = extract_and_transcribe(video_path, working_dir=os.path.join("backend", "data", "video_data"))
    transcript = result["transcript"]

    # Embed and store to LanceDB
    embed_model = SentenceTransformer("all-MiniLM-L6-v2")
    chunks = [transcript[i:i+300] for i in range(0, len(transcript), 300)]

    vs = LanceDBVectorStore()
    data = [{
        "id": str(uuid.uuid4()),
        "text": chunk,
        "embedding": embed_model.encode(chunk).tolist()
    } for chunk in chunks]
    vs.table.delete("true")  # this clears all rows
    vs.add_many(data)

    return {
        "status": "transcription complete",
        "transcript_file": result["transcript_path"],
        "transcript_excerpt": transcript[:500]
    }


# ---------------------------
# GET TRANSCRIPT FILE
# ---------------------------
@app.get("/get-transcript")
def get_transcript():
    transcript_path = os.path.join("backend", "data", "video_data", "input_vid.mp4_transcript.txt")

    if not os.path.exists(transcript_path):
        return {"status": "failed", "error": "Transcript not found."}

    return FileResponse(transcript_path, media_type="text/plain", filename="transcript.txt")


# ---------------------------
# ASK QUESTION USING GEMINI
# ---------------------------
class QuestionInput(BaseModel):
    question: str


@app.post("/ask")
def ask_question(input_data: QuestionInput):
    question = input_data.question

    vs = LanceDBVectorStore()
    context_chunks = vs.query(question)

    if not context_chunks:
        return {"status": "failed", "error": "No relevant context found."}

    prompt = f"""You are VidSage, an expert assistant for YouTube video content.
Use the following transcript context to answer the question:
Context: {context_chunks}
Question: {question}
Answer:"""

    try:
        response = model.generate_content(prompt)
        answer = response.text.strip()
    except Exception as e:
        return {"status": "failed", "error": str(e)}

    return {
        "status": "success",
        "question": question,
        "answer": answer
    }



from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
class TranscriptInput(BaseModel):
    transcript: str

@app.get("/generate-summary")
def generate_summary():
    transcript_path = os.path.join("backend", "data", "video_data", "input_vid_transcript.txt")

    if not os.path.exists(transcript_path):
        return {"status": "failed", "error": "Transcript file not found."}

    with open(transcript_path, "r", encoding="utf-8") as f:
        transcript = f.read()

    if not transcript.strip():
        return {"status": "failed", "error": "Transcript is empty."}

    prompt = f"""
You are an expert note-taking assistant. Create a detailed, well-structured, and clearly formatted summary from the following YouTube video transcript:

TRANSCRIPT:
{transcript}

INSTRUCTIONS:
- Divide content into clear sections with bold titles.
- Use bullet points where appropriate.
- Include definitions, examples, and key explanations.
- Format output in markdown-like style (headings, bullets, bold).
"""

    try:
        response = model.generate_content(prompt)
        notes = response.text.strip()
    except Exception as e:
        return {"status": "failed", "error": str(e)}

    return {
        "status": "success",
        "summary_notes": notes
    }



from fastapi.middleware.cors import CORSMiddleware


# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to match your React dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

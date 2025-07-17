from backend.rag.vectorstore import LanceDBVectorStore
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key="AIzaSyCKZT_t8wa0lIqFPvnD6FaYB0b13a9d6K4")

model = genai.GenerativeModel("gemini-2.0-flash")

def ask_question(question: str) -> str:
    vs = LanceDBVectorStore()
    context_chunks = vs.query(question)

    prompt = f"""You are VidSage, an expert assistant for YouTube video content.
    
Use the following transcript context to answer the question:
Context: {context_chunks}
Question: {question}
Answer:"""

    response = model.generate_content(prompt)
    return response.text.strip()

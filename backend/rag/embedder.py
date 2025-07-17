from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_passage(text: str):
    return model.encode([text])[0]

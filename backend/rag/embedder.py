from sentence_transformers import SentenceTransformer

#You can change this to another model like "intfloat/multilingual-e5-small"
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_passage(text: str):
    return model.encode([text])[0]

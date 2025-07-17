import lancedb
import pyarrow as pa
import os
from sentence_transformers import SentenceTransformer
import uuid

class LanceDBVectorStore:
    def __init__(self, db_path="backend/data/lancedb", table_name="vidsage_chunks"):
        self.db = lancedb.connect(db_path)
        self.embed_model = SentenceTransformer("all-MiniLM-L6-v2")

        schema = pa.schema([
            pa.field("id", pa.string()),
            pa.field("text", pa.string()),
            pa.field("embedding", pa.list_(pa.float32(), 384)),
        ])

        # ✅ Create if not exists
        if table_name not in self.db.table_names():
            self.table = self.db.create_table(table_name, schema=schema)
            print(f"[INFO] Created LanceDB table: {table_name}")
        else:
            self.table = self.db.open_table(table_name)
            print(f"[INFO] Opened existing LanceDB table: {table_name}")

    def add_many(self, items: list[dict]):
        self.table.add(items)

    def query(self, question: str):
        embedding = self.embed_model.encode(question).tolist()
        print("[DEBUG] Querying embedding for:", question)
        print("[DEBUG] Total rows in table:", self.table.   count_rows())
    
        results = self.table.search(embedding).limit(3).    to_list()
        print("[DEBUG] Raw search results:", results)

        return [r["text"] for r in results]

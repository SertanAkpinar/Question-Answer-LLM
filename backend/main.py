from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

# FastAPI-App
app = FastAPI()

# Modell laden
generator = pipeline('text-generation', model='gpt2')

# Pydantic-Datenmodell für Anfragen
class TextRequest(BaseModel):
    prompt: str

# Endpunkt zur Textgenerierung
@app.post("/generate/")
def generate_text(request: TextRequest):
    generated_text = generator(request.prompt, max_length=100, num_return_sequences=1)
    return {"generated_text": generated_text[0]['generated_text']}

# Starte den Server mit: uvicorn main:app --reload

# CORS-Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

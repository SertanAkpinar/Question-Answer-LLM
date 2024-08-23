pip install transformers datasets torch spacy

backend start:
uvicorn main_pokemon:app --reload;
frontend start:
npm run dev
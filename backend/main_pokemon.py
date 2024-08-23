from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import re  # Für einfache Textverarbeitung

app = FastAPI()

class PokemonRequest(BaseModel):
    pokemon_name: str
    question: str  # Frage, um die Art der Information zu bestimmen

# Funktion zum Abrufen von Pokémon-Daten von der PokeAPI
def get_pokemon_data(pokemon_name: str):
    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Pokémon nicht gefunden")
    return response.json()

# Funktion zum Abrufen von Entwicklungskette
def get_pokemon_evolution_chain(pokemon_species_url: str):
    species_data = requests.get(pokemon_species_url).json()
    evolution_chain_url = species_data["evolution_chain"]["url"]
    evolution_data = requests.get(evolution_chain_url).json()
    return evolution_data

@app.post("/pokemon/")
def answer_pokemon_question(request: PokemonRequest):
    try:
        # Hole Pokémon-Daten
        pokemon_data = get_pokemon_data(request.pokemon_name)
        name = pokemon_data['name']

        # Überprüfe die Frage mit regulären Ausdrücken und liefere die passende Antwort
        if re.search(r"typ|type", request.question.lower()):
            types = [t['type']['name'] for t in pokemon_data['types']]
            return {"answer": f"{name.capitalize()} ist vom Typ {', '.join(types)}."}

        elif re.search(r"attacken|moves|fähigkeiten", request.question.lower()):
            moves = [move['move']['name'] for move in pokemon_data['moves']]
            return {"answer": f"{name.capitalize()} kann die folgenden Attacken erlernen: {', '.join(moves[:10])}..."}

        elif re.search(r"entwickeln|evolution", request.question.lower()):
            species_url = pokemon_data['species']['url']
            evolution_data = get_pokemon_evolution_chain(species_url)
            evolution_chain = []

            chain = evolution_data['chain']
            while chain:
                evolution_chain.append(chain['species']['name'])
                if chain['evolves_to']:
                    chain = chain['evolves_to'][0]
                else:
                    break
            
            return {"answer": f"{name.capitalize()} entwickelt sich wie folgt: {' -> '.join(evolution_chain)}."}

        else:
            return {"answer": "Entschuldigung, ich verstehe die Frage nicht. Bitte frage nach Typen, Attacken oder Entwicklungen."}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# CORS-Einstellungen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open('PKMN_gen1.json', 'r') as file:
    pokemon_data = json.load(file)

def find_pokemon(name):
    for pokemon in pokemon_data:
        if pokemon['name']['english'].lower() == name.lower():
            return pokemon
    return None

@app.route('/pokemon/<name>', methods=['GET'])
def get_pokemon(name):
    pokemon = find_pokemon(name)
    if pokemon:
        return jsonify(pokemon)
    else:
        return jsonify({'error': 'Pokémon not found'}), 404

@app.route('/pokemon/<name>/<attribute>', methods=['GET'])
def get_pokemon_attribute(name, attribute):
    pokemon = find_pokemon(name)
    if pokemon:
        if attribute in pokemon:
            return jsonify({attribute: pokemon[attribute]})
        elif attribute in pokemon.get('base', {}):
            return jsonify({attribute: pokemon['base'][attribute]})
        elif attribute in pokemon.get('profile', {}):
            return jsonify({attribute: pokemon['profile'][attribute]})
        else:
            return jsonify({'error': 'Attribute not found'}), 404
    else:
        return jsonify({'error': 'Pokémon not found'}), 404

if __name__ == '__main__':
    app.run(port=3000, debug=True)

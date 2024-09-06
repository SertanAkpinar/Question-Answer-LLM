import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    try {
      // Extracting the Pokémon name and question from input using simple text processing
      const words = input.split(" ");
      const pokemonName = words.find(word => /^[A-Za-z]+$/.test(word)); // Finds first word with letters only (could be improved)
      const question = input;

      if (!pokemonName) {
        setOutput("Please mention a Pokémon name in your question.");
        return;
      }

      const response = await axios.post('http://localhost:8000/pokemon/', {
        pokemon_name: pokemonName,
        question: question
      });
      setOutput(response.data.answer);
    } catch (error) {
      console.error("Error generating answer", error);
      setOutput("Sorry, something went wrong.");
    }
  };

  return (
    <div className="App">
      <h1>Pokemon Question Answering</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question (e.g., Can Pikachu learn Thunderbolt?)"
      />
      <br />
      <button onClick={handleSubmit}>Get Answer</button>
      <p><strong>Answer:</strong> {output}</p>
    </div>
  );
}

export default App;

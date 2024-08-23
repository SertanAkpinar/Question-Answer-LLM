import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [question, setQuestion] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/pokemon/', {
        pokemon_name: pokemonName,
        question: question
      });
      setOutput(response.data.answer);
    } catch (error) {
      console.error("Error generating answer", error);
    }
  };

  return (
    <div className="App">
      <h1>Pokemon Question Answering</h1>
      <input
        type="text"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
        placeholder="Enter Pokemon Name"
      />
      <br />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question (e.g., What type is Pikachu?)"
      />
      <br />
      <button onClick={handleSubmit}>Get Answer</button>
      <p><strong>Answer:</strong> {output}</p>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';

interface GenerateResponse {
  generated_text: string;
}

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post<GenerateResponse>('http://localhost:8000/generate/', { prompt: input });
      setOutput(response.data.generated_text);
    } catch (error) {
      console.error("Error generating text", error);
    }
  };

  return (
    <div className="App">
      <h1>LLM Text Generator</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleSubmit}>Generate</button>
      <p><strong>Generated Text:</strong> {output}</p>
    </div>
  );
}

export default App;


//npm run dev
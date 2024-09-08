import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');
    setResult(null);  // Reset result on new submit

    const [name, ...attributeParts] = query.split(' ');
    const attribute = attributeParts.join(' ').trim();

    try {
      let url: string;

      // Try fetching as Pokémon first
      url = `http://localhost:3000/pokemon/${name}${attribute ? '/' + attribute : ''}`;
      try {
        const response = await axios.get<Record<string, any>>(url);
        setResult(response.data);
      } catch (pokemonError) {
        // If Pokémon not found, try fetching as a Type
        url = `http://localhost:3000/type/${name}${attribute ? '/' + attribute : ''}`;
        try {
          const typeResponse = await axios.get<Record<string, any>>(url);
          setResult(typeResponse.data);
        } catch (typeError) {
          // If both Pokémon and Type not found, handle error
          setError('Pokémon or Type or Attribute not found');
          setResult(null);
        }
      }
    } catch (err) {
      setError('Pokémon or Type or Attribute not found');
      setResult(null);
    }
  };

  const renderResult = (data: Record<string, any>) => {
    if (typeof data === 'object') {
      return Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="App">
      <h1>Pokémon Info Finder</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Query:
          <input type="text" value={query} onChange={handleInputChange} />
        </label>
        <button type="submit">Get Info</button>
      </form>
      {result && renderResult(result)}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;



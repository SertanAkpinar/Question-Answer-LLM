/*import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [pokemonName, setPokemonName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPokemonName(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.get<{ type: string[] }>(`http://localhost:3000/pokemon/type/${pokemonName}`);
      setType(response.data.type.join(', '));
    } catch (err) {
      setError('Pokémon not found');
      setType('');
    }
  };
  

  return (
    <div className="App">
      <h1>Pokémon Type Finder</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Pokémon Name:
          <input type="text" value={pokemonName} onChange={handleInputChange} />
        </label>
        <button type="submit">Get Type</button>
      </form>
      {type && <p>Type: {type}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App; */

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

    const [name, ...attributeParts] = query.split(' ');
    const attribute = attributeParts.join(' '); // Der Rest ist die gewünschte Eigenschaft

    try {
      let url = `http://localhost:3000/pokemon/${name}`;
      if (attribute) {
        url += `/${attribute}`;
      }

      const response = await axios.get<Record<string, any>>(url);
      setResult(response.data);
    } catch (err) {
      setError('Pokémon or attribute not found');
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
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCocktail = async () => {
    setLoading(true);
    try {
      const prompt = `create a unique cocktail that has never been made before using any of the following ingredients: ${ingredients}. Give the cocktail a unique name.`;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
  prompt,
  max_tokens: 100,
  n: 1,
  stop: null,
  temperature: 0.8,
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  },
});

      const generatedRecipe = response.data.choices[0].text.trim();
      setRecipe(generatedRecipe);
    } catch (error) {
      console.error('Error fetching cocktail recipe:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Unique Cocktail Generator</h1>
      <label htmlFor="ingredients">Enter ingredients:</label>
      <input
        type="text"
        id="ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="e.g. vodka, orange juice, grenadine"
      />
      <button onClick={fetchCocktail} disabled={loading}>
        {loading ? 'Loading...' : 'Find a Cocktail'}
      </button>
      {recipe && (
        <div>
          <h2>Generated Cocktail Recipe:</h2>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
}

export default App;

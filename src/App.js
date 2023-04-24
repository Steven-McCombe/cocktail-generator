import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const ingredientOptions = [
  // Liquors
  { value: 'vodka', label: 'Vodka' },
  { value: 'gin', label: 'Gin' },
  { value: 'rum', label: 'Rum' },
  // Whiskeys
  { value: 'scotch', label: 'Scotch' },
  { value: 'bourbon', label: 'Bourbon' },
  // Mixers
  { value: 'tonic water', label: 'Tonic Water' },
  { value: 'orange juice', label: 'Orange Juice' },
  // Herbs
  { value: 'mint', label: 'Mint' },
  { value: 'basil', label: 'Basil' },
  // Fruits
  { value: 'lemon', label: 'Lemon' },
  { value: 'lime', label: 'Lime' },
];

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCocktail = async () => {
    setLoading(true);
    const ingredients = selectedIngredients.map(ingredient => ingredient.value).join(', ');
    try {
      const prompt = `Generate a unique cocktail recipe using the following ingredients: ${ingredients}.`;
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
      <label htmlFor="ingredients">Select ingredients:</label>
      <Select
        isMulti
        id="ingredients"
        options={ingredientOptions}
        onChange={setSelectedIngredients}
        className="basic-multi-select"
        classNamePrefix="select"
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

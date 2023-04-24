import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const categories = {
  liquors: [
    { value: 'vodka', label: 'Vodka' },
    { value: 'gin', label: 'Gin' },
    { value: 'rum', label: 'Rum' },
  ],
  whiskeys: [
    { value: 'scotch', label: 'Scotch' },
    { value: 'bourbon', label: 'Bourbon' },
  ],
  mixers: [
    { value: 'tonic water', label: 'Tonic Water' },
    { value: 'orange juice', label: 'Orange Juice' },
  ],
  herbs: [
    { value: 'mint', label: 'Mint' },
    { value: 'basil', label: 'Basil' },
  ],
  fruits: [
    { value: 'lemon', label: 'Lemon' },
    { value: 'lime', label: 'Lime' },
  ],
};

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const addCustomIngredient = () => {
    if (customIngredient) {
      setSelectedIngredients([
        ...selectedIngredients,
        { value: customIngredient, label: customIngredient },
      ]);
      setCustomIngredient('');
    }
  };

  const fetchCocktail = async () => {
    setLoading(true);
    const ingredients = selectedIngredients.map(ingredient => ingredient.value).join(', ');
    try {
      const prompt = `Generate a unique cocktail recipe using the following ingredients: ${ingredients}. Respond with the following format: Name, Ingredients:List , Instructions: list`;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        prompt,
        max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 1.0,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      const generatedRecipe = response.data.choices[0].text.trim().split(',').join(',\n');
      setRecipe(generatedRecipe);
    } catch (error) {
      console.error('Error fetching cocktail recipe:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Unique Cocktail Generator</h1>
      {Object.entries(categories).map(([category, options]) => (
        <div key={category}>
          <label htmlFor={`${category}-ingredients`}>{category.charAt(0).toUpperCase() + category.slice(1)}:</label>
          <Select
            isMulti
            id={`${category}-ingredients`}
            options={options}
            value={selectedIngredients.filter(ingredient => options.includes(ingredient))}
            onChange={(newOptions) => {
              const otherIngredients = selectedIngredients.filter(ingredient => !options.includes(ingredient));
              setSelectedIngredients([...otherIngredients, ...newOptions]);
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
      ))}
      <div>
        <label htmlFor="custom-ingredient">Custom Ingredient:</label>
        <input
          id="custom-ingredient"
          type="text"
          value={customIngredient}
          onChange={(e) => setCustomIngredient(e.target.value)}
        />
        <button onClick={addCustomIngredient}>Add</button>
      </div>
      <button onClick={fetchCocktail} disabled={loading}>
        {loading ? 'Loading...' : 'Find a Cocktail'}
      </button>
      {recipe && (
        <div>
          <h2>Generated Cocktail Recipe:</h2>
          <pre>{recipe}</pre>
        </div>
      )}
    </div>
  );
}
 
export default App;
    
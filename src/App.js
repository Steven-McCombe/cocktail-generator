import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const categories = {
  spirits: [
    { value: 'vodka', label: 'Vodka' },
    { value: 'gin', label: 'Gin' },
    { value: 'rum', label: 'Rum' },
    { value: 'tequila', label: 'Tequila' },
    { value: 'whiskey', label: 'Whiskey' },
  ],
  liqueurs: [
    { value: 'triple sec', label: 'Triple Sec' },
    { value: 'kahlua', label: 'Kahlua' },
    { value: 'baileys', label: "Bailey's Irish Cream" },
  ],
  wines: [
    { value: 'red wine', label: 'Red Wine' },
    { value: 'white wine', label: 'White Wine' },
    { value: 'prosecco', label: 'Prosecco' },
    { value: 'champagne', label: 'Champagne' },
  ],
  beers: [
    { value: 'lager', label: 'Lager' },
    { value: 'ale', label: 'Ale' },
    { value: 'cider', label: 'Cider' },
  ],
  mixers: [
    { value: 'tonic water', label: 'Tonic Water' },
    { value: 'cola', label: 'Cola' },
    { value: 'lemonade', label: 'Lemonade' },
    { value: 'ginger ale', label: 'Ginger Ale' },
  ],
  fruits: [
    { value: 'lemon', label: 'Lemon' },
    { value: 'lime', label: 'Lime' },
    { value: 'orange', label: 'Orange' },
    { value: 'pineapple', label: 'Pineapple' },
    { value: 'strawberry', label: 'Strawberry' },
  ],
  herbs: [
    { value: 'mint', label: 'Mint' },
    { value: 'basil', label: 'Basil' },
    { value: 'rosemary', label: 'Rosemary' },
    { value: 'thyme', label: 'Thyme' },
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
      const prompt = `Generate a cocktail recipe using any of the following ingredients(Remember you don't have to use all of the, bonus points if you create something unique. You can assume i have some general household ingredients like milk, coffee, pepper etc.): ${ingredients}. Respond with the following format: Name:, Ingredients:, Instructions:. You should also take into consideration dangerous ingredients that are not fit for human consumption and ignore them. Include measurements for all ingredients`;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        prompt,
        max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 0.8,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });
  
      const rawGeneratedRecipe = response.data.choices[0].text.trim();
      const parts = rawGeneratedRecipe.split(/, (?=[a-zA-Z]+:)/); // Split on commas followed by a word and a colon
      const formattedRecipe = parts.map((part, index) => {
        if (index === 0) {
          return `<b>Name:</b> ${part}`;
        } else if (index === 1) {
          return `<b>Ingredients:</b>${part.replace('Ingredients:', '').replace(/, /g, '<br/>')}`;
        } else if (index === 2) {
          return `<b>Instructions:</b>${part.replace('Instructions:', '').replace(/, /g, '<br/>')}`;
        }
        return part;
      }).join('<br/>');
      setRecipe(formattedRecipe);
    } catch (error) {
      console.error('Error fetching cocktail recipe:', error);
    }
    setLoading(false);
  };
  

  return (
    <div className="App">
    <h1>Unique Cocktail Generator</h1>
    <div className="ingredient-grid">
      {Object.entries(categories).map(([category, options]) => (
        <div key={category} className="ingredient-category">
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
    </div>
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
    <pre dangerouslySetInnerHTML={{ __html: recipe }}></pre>
  </div>
)}

    </div>
  );
}

export default App;
    
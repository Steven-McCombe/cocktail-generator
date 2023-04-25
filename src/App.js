import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Container, Grid, Card, CardContent, Typography, Modal, Box, TextField, Button, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

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
  const [openModal, setOpenModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = (category) => {
    setCurrentCategory(category);
    setOpenModal(true);
  };

  

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          Unique Cocktail Generator
        </Typography>
        <Grid container spacing={4}>
          {Object.keys(categories).map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Card onClick={() => handleOpenModal(category)} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%', // Adjust the width
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              id="modal-title"
              sx={{ color: 'text.primary' }} // Change font color
            >
              {currentCategory && currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
            </Typography>
            <Select
              isMulti
              options={currentCategory && categories[currentCategory]}
              value={selectedIngredients.filter(
                (ingredient) => currentCategory && categories[currentCategory].includes(ingredient),
              )}
              onChange={(newOptions) => {
                const otherIngredients = selectedIngredients.filter(
                  (ingredient) => !categories[currentCategory].includes(ingredient),
                );
                setSelectedIngredients([...otherIngredients, ...newOptions]);
              }}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  color: state.isSelected ? 'white' : 'black', // Change font color based on the selection state
                }),
              }}
            />
          </Box>
        </Modal>
        <div>
          <TextField
            id="custom-ingredient"
            label="Custom Ingredient"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            sx={{ marginTop: 2, marginBottom: 2, marginRight: 1 }}
          />
          <Button onClick={addCustomIngredient} variant="contained" color="primary" >
            Add
          </Button>
        </div>
        <Button
          onClick={fetchCocktail}
          disabled={loading}
          variant="contained"
          color="secondary"
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          {loading ? 'Loading...' : 'Find a Cocktail'}
        </Button>
        {recipe && (
          <Paper
            elevation={3}
            sx={{
              marginTop: 4,
              padding: 3,
              borderRadius: 2,
              backgroundColor: 'background.default',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Cocktail Recipe
            </Typography>
            <div
              dangerouslySetInnerHTML={{ __html: recipe }}
              style={{ whiteSpace: 'pre-wrap' }}
            ></div>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
    
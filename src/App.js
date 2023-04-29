import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Container, Typography, Modal, Box, TextField, Button, Paper, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import LocalBar from '@mui/icons-material/LocalBar';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import backgroundImage from './bg.png';


const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722', // Deep blue
    },
    secondary: {
      main: '#ff5722', // Vibrant orange
    },
    background: {
      default: '#fff8e1', // Light cream
      paper: '#fff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
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
    { value: 'scotch', label: 'Scotch' },
    { value: 'bourbon', label: 'Bourbon' },
  ],
  liqueurs: [
    { value: 'triple sec', label: 'Triple Sec' },
    { value: 'kahlua', label: 'Kahlua' },
    { value: 'baileys', label: "Bailey's Irish Cream" },
    { value: 'cointreau', label: 'Cointreau' },
{ value: 'amaretto', label: 'Amaretto' },
{ value: 'frangelico', label: 'Frangelico' },
{ value: 'chambord', label: 'Chambord' },
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
    { value: 'stout', label: 'Stout' },
{ value: 'pilsner', label: 'Pilsner' },
{ value: 'wheat beer', label: 'Wheat Beer' },
{ value: 'sour beer', label: 'Sour Beer' },
  ],
  mixers: [
    { value: 'tonic water', label: 'Tonic Water' },
    { value: 'cola', label: 'Cola' },
    { value: 'lemonade', label: 'Lemonade' },
    { value: 'ginger ale', label: 'Ginger Ale' },
    { value: 'soda water', label: 'Soda Water' },
    { value: 'cranberry juice', label: 'Cranberry Juice' },
    { value: 'pineapple juice', label: 'Pineapple Juice' },
    { value: 'orange juice', label: 'Orange Juice' },
  ],
  fruits: [
    { value: 'lemon', label: 'Lemon' },
    { value: 'lime', label: 'Lime' },
    { value: 'orange', label: 'Orange' },
    { value: 'pineapple', label: 'Pineapple' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'blueberry', label: 'Blueberry' },
{ value: 'kiwi', label: 'Kiwi' },
  ],
  herbs: [
    { value: 'mint', label: 'Mint' },
    { value: 'basil', label: 'Basil' },
    { value: 'rosemary', label: 'Rosemary' },
    { value: 'thyme', label: 'Thyme' },
    { value: 'lavender', label: 'Lavender' },
{ value: 'sage', label: 'Sage' },
{ value: 'oregano', label: 'Oregano' },
  ],
};

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [nestedAnchorEl, setNestedAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const addCustomIngredient = () => {
    if (customIngredient) {
      const ingredients = customIngredient.split(',').map((i) => i.trim());
      const newIngredients = ingredients.map((ingredient) => ({
        value: ingredient,
        label: ingredient,
      }));
      setSelectedIngredients([...selectedIngredients, ...newIngredients]);
      setCustomIngredient('');
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNestedMenuOpen = (event, category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setNestedAnchorEl(null);
    } else {
      setSelectedCategory(category);
      setNestedAnchorEl(event.currentTarget);
    }
  };
  
  const removeSelectedIngredient = (ingredientToRemove) => {
    setSelectedIngredients(selectedIngredients.filter((ingredient) => ingredient.value !== ingredientToRemove.value));
  };
  

const handleNestedMenuClose = () => {
  setNestedAnchorEl(null);
};
  const fetchCocktail = async () => {
    setLoading(true);
    const ingredients = selectedIngredients.map(ingredient => ingredient.value).join(', ');
    try {
      const prompt = `You will be provided with ingredients delimited by triple quotes. \
      your task is to create a cocktail recipe using those ingredients. \
      you can use a recipe that already exists but you should also consider a unique cocktail.\
      You need to ensure that the cocktail is fit for human consumption. \
      if the ingredients list contains an ingredient that is not safe to consume please exclude that from the recipe.\
      You do not have to use every ingredient listed and you can assume that I have general household ingredients like salt/pepper etc.\
      When you have completed this task you should perform the following actions.\
      1. Devise an Name for the Cocktail format this in HTML with a Cocktail Name heading. \
      2. List the ingredients for the Cocktail along with the required measurements per serving. Format this list in HTML with an ingredients heading\
      3. Create a step by step instructions for how to create the cocktail. Return the step by steps as a numbered sequence. Format this in HTML with an instructions heading\
      4. Calculate the nutritional value of the cocktail and return a HTML formatted table with a Nutrition heading include the following in the table Calories, Total Fat, Cholesterol, Sodium, total Carbohydrates (Fiber/Sugars), Protein, Vitamin C, Calcium, Iron, Potassium. You should also include the % daily value of these nutrients. The % Daily Value (DV) tells you how much a nutrient in a food serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice. \
      """${ingredients}"""\
      `;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt,
        max_tokens: 500,
        n: 1,
        stop: null,
        temperature: 0.2,
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
    <Container maxWidth="md" className="App" style={{
      backgroundImage: `url('${backgroundImage}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontFamily: 'cursive', color: 'text.secondary' }} // Update the font family and color
      >
          PourPal
        </Typography>
        <AppBar position="static">
  <Toolbar>
    <Box
      onClick={handleMenuClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <IconButton edge="start" color="inherit" aria-label="menu">
        <LocalBar />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Quick Add Ingredients
      </Typography>
    </Box>
  </Toolbar>
</AppBar>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
    >
      {Object.keys(categories).map((category) => (
  <MenuItem
    key={category}
    onClick={(event) => handleNestedMenuOpen(event, category)}
  >
    {category.charAt(0).toUpperCase() + category.slice(1)}
  </MenuItem>
))}
    </Menu>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
    >
   {Object.keys(categories).map((category) => (
  <MenuItem
    key={category}
    onMouseEnter={(event) => handleNestedMenuOpen(event, category)}
  >
    {category.charAt(0).toUpperCase() + category.slice(1)}
  </MenuItem>
))}
    </Menu>
    <Menu
  anchorEl={nestedAnchorEl}
  open={Boolean(nestedAnchorEl)}
  onClose={handleNestedMenuClose}
  onClick={handleNestedMenuClose}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
  getContentAnchorEl={null}
>
  {selectedCategory &&
    categories[selectedCategory].map((ingredient) => (
      <MenuItem
        key={ingredient.value}
        onClick={() => {
          setSelectedIngredients([
            ...selectedIngredients,
            { value: ingredient.value, label: ingredient.label },
          ]);
        }}
      >
        {ingredient.label}
      </MenuItem>
    ))}
</Menu>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: 2, marginBottom: 2 }}>
          <TextField
            id="custom-ingredient"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            sx={{ flexGrow: 1, marginRight: 1 }}
            placeholder="Custom Ingredients e.g., cranberry juice, grenadine, orgeat"
            fullWidth
          />
          <Button onClick={addCustomIngredient} variant="contained" color="primary" size="small">
            Add
          </Button>
        </Box>
        <Button
          onClick={fetchCocktail}
          disabled={loading}
          variant="contained"
          color="secondary"
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          {loading ? 'Loading...' : 'Create a Cocktail'}
        </Button>
        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
  <Typography variant="h6" component="h3" gutterBottom>
    Your Home Bar Ingredients:
  </Typography>
  {selectedIngredients.map((ingredient) => (
    <Box
      key={ingredient.value}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        padding: 0.5,
        margin: 0.5,
      }}
    >
      <Typography variant="caption">{ingredient.label}</Typography>
      <IconButton
        edge="end"
        size="small"
        onClick={() => removeSelectedIngredient(ingredient)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  ))}
</Box>
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
            


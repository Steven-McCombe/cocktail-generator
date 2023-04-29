import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Paper, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import LocalBar from '@mui/icons-material/LocalBar';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from './logonew.png';

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
      const prompt = `You will be provided with a list of ingredients separated by triple quotes. \ Your task is to create a cocktail recipe using some of those ingredients, up to a maximum of 5 ingredients. You don't have to use all of them. \ You may use an existing recipe or create a unique cocktail. \ Please ensure that the cocktail is safe and fit for human consumption. \ If the ingredients list contains an item that is not safe to consume, exclude it from the recipe.\ You can assume the availability of general household ingredients like salt and pepper.\ Once you have completed this task, please perform the following actions:\ 1. Verify that you have adhered to all instructions in the task, especially avoiding the inclusion of ingredients unfit for human consumption. 2. Provide a name for the cocktail and format it in HTML with a Cocktail Name heading. \ 3. List the ingredients for the cocktail along with the required measurements per serving. Format this list in HTML with an 'Ingredients' heading.\ 4. Create step-by-step instructions for preparing the cocktail. Return the instructions as a numbered sequence, formatted in HTML with an 'Instructions' heading.\ 5. Calculate the nutritional value of the cocktail and return an HTML formatted table with a 'Nutrition' heading. Include the following in the table: Calories, Total Fat, Sodium, Total Carbohydrates (Fiber/Sugars), and the % daily value of these nutrients. The % Daily Value (DV) indicates how much a nutrient in a food serving contributes to a daily diet. Use 2,000 calories a day for general nutrition advice. \ """${ingredients}"""\ `;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt,
        max_tokens: 1000,
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
   
      setRecipe(rawGeneratedRecipe);
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

  const printRecipe = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print Recipe</title></head><body>');
    printWindow.document.write('<h1>' + 'PourPal.AI' + '</h1>');
    printWindow.document.write('<p>' + 'Sip the Future: AI-powered cocktails made just for you' + '</p>');
    printWindow.document.write(document.getElementById('recipe-content').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const DISCLAIMER = "Disclaimer: The cocktails generated by our AI are intended for entertainment purposes only. By using this site, you agree that you are solely responsible for your own consumption of these cocktails and that we will not be held liable for any damages, injuries, or health consequences that may arise from your use of the recipes provided. Please consume alcohol responsibly and be mindful of your own health, allergies, and any medical conditions. If you are unsure about the safety of a particular ingredient or cocktail, consult a healthcare professional before consumption. Drink responsibly and never drink and drive.";

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="md" className="App" style={{
    }}>
       <Box
      sx={{
        display: 'flex',
      }}
    >
      <img src={logo} alt="Logo" style={{ width: '64px', height: 'auto' }} />
      <h1>PourPal.ai</h1>

    </Box>
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
        Quick Add
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
            placeholder="Custom Ingredients e.g., cranberry juice, grenadine, vodka."
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
  {loading ? (
    <>
      <CircularProgress size={24} color="inherit" />
      <span style={{ marginLeft: '8px' }}>Loading...</span>
    </>
  ) : (
    'Create a Cocktail'
  )}
</Button>
        <Box sx={{ marginTop: 2, marginBottom: 2 }}>

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
        <ClearIcon fontSize="small" />
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
    id = "recipe-content"
      dangerouslySetInnerHTML={{ __html: recipe }}
      style={{ whiteSpace: 'pre-wrap' }}
    ></div>
    <Typography variant="body2" component="p" sx={{ marginTop: 4, marginBottom: 2 }}>
      {DISCLAIMER}
    </Typography>
    <Button
  variant="contained"
  color="primary"
  sx={{ marginTop: 2 }}
  onClick={printRecipe}
>
  Print Recipe
  </Button>
  </Paper>
)}
      </Container>
    </ThemeProvider>
  );
}

export default App;
            


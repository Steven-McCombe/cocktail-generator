const prompt = `You will be provided with ingredients delimited by triple quotes. \
your task is to create a cocktail recipe using some of those ingredients, you dont have to use them all. \
you can use a recipe that already exists but you should also consider a unique cocktail.\
You need to ensure that the cocktail is fit for human consumption. \
if the ingredients list contains an ingredient that is not safe to consume please exclude that from the recipe.\
You do not have to use every ingredient listed and you can assume that I have general household ingredients like salt/pepper etc.\
When you have completed this task you should perform the following actions.\
1. Devise an Name for the Cocktail format this in HTML with a Cocktail Name heading. \
2. List the ingredients for the Cocktail along with the required measurements per serving. Format this list in HTML with an ingredients heading\
3. Create a step by step instructions for how to create the cocktail. Return the step by steps as a numbered sequence. Format this in HTML with an instructions heading\
4. Calculate the nutritional value of the cocktail and return a HTML formatted table with a Nutrition heading and serving size sub heading, include the following in the table Calories, Total Fat, Cholesterol, Sodium, total Carbohydrates (Fiber/Sugars), Protein, Vitamin C, Calcium, Iron, Potassium. You should also include the % daily value of these nutrients. The % Daily Value (DV) tells you how much a nutrient in a food serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice. \
5. Double check that you are following all of the above steps. 
"""${ingredients}"""\
`;
/*Uses the scraped data and the filters requested from client, to select the recipes to 
return. 
*/
const { queryData } = require ('./query_data');

async function parse(filters){
   // const sqlIngredient = filters[ingredient];//??
    const ingredientFilter = 'SELECT * from recipes\
    LEFT JOIN ingredients ON recipes.id = ingredients.recipe_id\
    WHERE ? in ingredients;'
    
    let parsed_data = queryData(ingredientFilter, filters[ingredient]);

    //FIXME problem here is idk how queried data is returned
    return parsed_data;

    //recipe
    //grilled chz 1
    //pasta 2

    //ingredients
    //cheese 1
    //bread 1
    //noodles 2
    //sauce 2
    //will always have 3 filters. ingredient, exclusion, and diet
    //query 3 times? sub queries? 
    

    //SELECT * from recipes
    //LEFT JOIN ingredients
    //ON recipes.id = ingredients.recipe_id
    //WHERE ingredient in ingredients;



 //   filters.ingredient
 //   filters.exclusion
 //   filters.diet
 //do some sql nonesense

}

module.exports = {
   parse
};
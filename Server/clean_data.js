/*Clean the scraped data by removing unnecessary adjectives, adverbs, and filler words
* before storing the data in the database. Called From web_scraper.js */

const mysql = require('mysql2');
const { queryData } = require('./query_data');


//const remove_words = ["finely", "chopped", ", or to taste", ",divided", ",plus more for serving" ]
//FIXME this probably doesn't replace the data if i've read it through and didn't 
//scrape it this time

//Still need to continue wiht cleaning strats

async function clean(ingredient_list){

    //STORE ALL DATA INTO TABLES FIRST THING HERE
    const storeRecipe = "INSERT INTO recipes VALUES ?";
    const storeIngredients = "INSERT INTO ingredients VALUES ?" //and recipe id

    let text;
    let index;
    const recipe_names = [];
    let replacement_map = new Map();

    //Parse through each individual recipe
    let key_id = 0;
    for (let[key,value] of ingredient_list){
        //Store recipe into recipe
        //Stores all ingredients for recipe into ingredients

        //If recipe_name already exists in list, pass over
        if (recipe_names.includes(key)){
            ingredient_list.delete(key)
            continue;
        }
        else{
            recipe_names.append(key);
        }

        //As long as ingredient list is greater than 0, continue to parse
        for (let i = 0; i < value.length; i++){
            let ingredient = value[i];

            if (ingredient.match(/[(),]/)){
                index = ingredient.search(/[,()]/);
                text = ingredient.slice(0,index)
                value[i] = text
            }
        }
       // replacement_map.set(key, value);
                
       //JSON.stringify ingredients
       // const recipeJSON = JSON.stringify(Object.fromEntries(replacement_map))

       /*Store cleaned data in sql database */
        queryData(storeRecipe, key);
        queryData(storeIngredients, value);

        //await fs.writeFile("links.json", recipeJSON);
               // value.replace(word, '-')
      //  }
    }
    
    console.log(ingredient_list)

}


module.exports = {
    clean
};
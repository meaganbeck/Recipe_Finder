/*Clean the scraped data by removing unnecessary adjectives, adverbs, and filler words
* before storing the data in the database. Called From web_scraper.js */

const mysql = require('mysql2');
const { queryData } = require('./query_data');


//const remove_words = ["finely", "chopped", ", or to taste", ",divided", ",plus more for serving" ]
//FIXME this probably doesn't replace the data if i've read it through and didn't 
//scrape it this time

//Still need to continue wiht cleaning strats
//update in db. it's already in there though
const recipe_names = [];

async function clean(ingredient_list){

    let text;
    let index;
    let replacement_map = new Map();
    let clean_map = new Map();

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
        

            //As long as ingredient list is greater than 0, continue to parse
            for (let i = 0; i < value.length; i++){
                let ingredient = value[i];
                //Any text in parenthesis is removed
                if (ingredient.match(/[(),]/)){
                    index = ingredient.search(/[,()]/);
                    text = ingredient.slice(0,index)
                    value[i] = text
                }
        }
        }
        clean_map.set(key,value);

        return clean_map;

    }

}


module.exports = {
    clean
};
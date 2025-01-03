/*Clean the scraped data by removing unnecessary adjectives, adverbs, and filler words
* before storing the data in the database. Called From web_scraper.js */

const mysql = require('mysql2');
const { queryData } = require('./query_data');


//const remove_words = ["finely", "chopped", ", or to taste", ",divided", ",plus more for serving" ]
//FIXME this probably doesn't replace the data if i've read it through and didn't 
//scrape it this time

//USE SQL TO REDO THIS

async function clean(ingredient_list){

    let text;
    let index;
    const names = [];
    let replacement_map = new Map();
    for (let[key,value] of ingredient_list){
  //      for (word of remove_words){
        //console.log(value)
        if (names.includes(key)){
            ingredient_list.delete(key)
            continue;
        }
        else{
            names.append(key);
        }
        for (let i = 0; i < value.length; i++){
      //  for (const ingredient of value){
            let ingredient = value[i];
            if (ingredient.match(/[(),]/)){
                index = ingredient.search(/[,()]/);
                //index = ingredient.indexOf(',')
                text = ingredient.slice(0,index)
                //console.log(text);
                value[i] = text
            //    value.replace(ingredient, text)
            }
        }
        replacement_map.set(key, value);
                
                //JSON.stringify ingredients
        const recipeJSON = JSON.stringify(Object.fromEntries(replacement_map))

        await fs.writeFile("links.json", recipeJSON);
               // value.replace(word, '-')
      //  }
        //console.log(value)
    }
    

    //Probably print back out to file
    console.log(ingredient_list)

}


module.exports = {
    clean
};
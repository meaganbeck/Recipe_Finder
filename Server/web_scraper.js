/*Webscraper to gather recipe data from the website Allrecipes.com*/

const puppeteer = require('puppeteer')

const fs = require('fs').promises;
const mysql = require('mysql2');

const { clean }= require('./clean_data');
const { queryData } = require ('./query_data');



//TODO: add error handlers and work on efficiency
//TODO: update github


async function scrape(){

    /*Create new browser*/
    const browser = await puppeteer.launch()

    /*Create new tab*/
    const page = await browser.newPage()

    /*Go to allrecipes main website*/
    await page.goto("https://www.allrecipes.com/recipes-a-z-6735880")

    /*Scrape links to recipe categories*/
    const links = await page.$$eval('.comp .mntl-link-list__item > a', (elements) => {
        return elements.map(x => x.href)
    }) 
    

    const recipeID = 0;
    const ingredient_list = new Map(); 

    /*Loop through list of recipe categories*/
    for (const link of links){
        await page.goto(link)

        /**Get the links to individual recipes in that category */
        const recipe_links = await page.$$eval('a.comp.mntl-card-list-items.mntl-document-card.mntl-card.card.card--no-image', (elements) =>{
            return elements.map(x => x.href)
        })

        /**Loop through the recipes and get the ingredients */
        for (const recipe_link of recipe_links){
            await page.goto(recipe_link)
            
            /*Check if that recipes is a link to multiple recipes*/
            const extra_links = await page.$$eval('div.comp.mntl-sc-block.allrecipes-sc-block-featuredlink.mntl-sc-block-universal-featured-link.mntl-sc-block-universal-featured-link--button > a', (elements) => {
                return elements.map(x => x.href)
            })
            /*If it is link to multiple recipes, push those to the list to scrape*/
            if (extra_links.length > 0){
                for (const extra_link of extra_links){
                    recipe_links.push(extra_link)
                }
            }
            else{
                const nameElement = await page.$('h1.article-heading', el => el.innerText);

                let name;
                /**Get the name, if there is one. */
                if (nameElement) {
                    name = await page.$eval('h1.article-heading.type--lion', el => el.innerText);
                }
                else{
                    console.warn(`Didn't find name of recipe at ${recipe_link}`);
                    continue; //skip to next recipe
                }

                /**Scrape the ingredients for that recipe */
                const ingredients = await page.$$eval('li.mm-recipes-structured-ingredients__list-item > p > span[data-ingredient-name="true"]', (elements) => {
                    return elements.map(x => x.innerText)
                });

                /*Add the ingredients to the Map of ingredients*/
                ingredient_list.set(name, ingredients);


                /**Create sql queries to store recipes into database */
                const query_store_recipe = 'INSERT INTO recipes (name) WHERE name = ?;';
                const query_store_ing = 'INSERT INTO ingredients (ingredient) WHERE ingredients = ? AND recipe_id = ?;';
                
                /**Call queries. Store recipe name in 'recipes' table. Store ingredients in 
                 * 'ingredient table, with recipeID to refer to. 
                 */
                queryData(query_store_recipe, name);
                for (ing in ingredients){
                    queryData(query_store_ing, [ing, recipeID]);
                }
                /**Increment recipeID (I forgot to Autoincrement recipeID in table creation) */
                recipeID++;
            }
        }
    

    }
    //CLEAN directly from here 
  //  let cleaned_ingredients = clean(ingredient_list)
    await browser.close()


    //Clean the data. 
    //TODO: maybe clean and then store? maybe call clean for each recipe??
    clean(ingredient_list);
    return ingredient_list; //ingredient_list is a Map object

}

/*function convert_csv (data){
    let header = Object.keys(data[0]).join(',');
    let body = data.map(row => {
        Object.values(row).map(value=> 
            Array.isArray(value) ? value.join('; ') : value
        ).join(',');
    }).join('\n');
    return `${header}\n${body}`;

}*/

/*
function load_data(data){

    /*const sql = 'LOAD DATA INFILE \'links.csv\'
        INTO TABLE table_name
        FIELDS TERMINATED BY /',/'
        LINES TERMINATED BY '\n'
        (column1, column2, column3);'*/

  /*  recipeDB.connect(function(err) {
        if(err) throw err;
        recipeDB.query(sql, (err, result) => {
            if(err) throw err,
            res.send(result);
        })
    });


}*/


//scrape();
module.exports = {
    scrape
};
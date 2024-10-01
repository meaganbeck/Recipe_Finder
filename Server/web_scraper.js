const puppeteer = require('puppeteer')

const fs = require('fs').promises;


//add error handlers and work on efficiency
//update github


async function scrape(){

    //Create new browser
    const browser = await puppeteer.launch()

    //Create new tab
    const page = await browser.newPage()

    //Go to allrecipes main website
    await page.goto("https://www.allrecipes.com/recipes-a-z-6735880")

    //Good!
    const links = await page.$$eval('.comp .mntl-link-list__item > a', (elements) => {
        return elements.map(x => x.href)
    }) 
    


    const ingredient_list = new Map(); 
    //Loop through each recipe category
    for (const link of links){
        await page.goto(link)

        //get the links of each individual recipe in that category
        const recipe_links = await page.$$eval('a.comp.mntl-card-list-items.mntl-document-card.mntl-card.card.card--no-image', (elements) =>{
            return elements.map(x => x.href)
        })

        //loop through the recipes and get the ingredients
        for (const recipe_link of recipe_links){
            await page.goto(recipe_link)
            
            //Check if that recipe is a link of recipes
            const extra_links = await page.$$eval('div.comp.mntl-sc-block.allrecipes-sc-block-featuredlink.mntl-sc-block-universal-featured-link.mntl-sc-block-universal-featured-link--button > a', (elements) => {
                return elements.map(x => x.href)
            })
            //const extra_links = await page.$$eval('a.comp.mntl-card-list-items.mntl-document-card.mntl-card.card.card--no-image', (elements) =>{
            //    return elements.map(x => x.href)
            //})

            if (extra_links.length > 0){
                for (const extra_link of extra_links){
                    recipe_links.push(extra_link)
                }
            }
            else{
                //get the recipe name
                //WORK ON THIS//.type--lion

                const nameElement = await page.$('h1.article-heading', el => el.innerText);
                let name;
                if (nameElement) {
                    name = await page.$eval('h1.article-heading.type--lion', el => el.innerText);
                }
                else{
                    console.warn(`Didn't find name of recipe at ${recipe_link}`);
                    continue; //skip to next recipe
                }
                //get the list of ingredients
                //document.querySelector("#article-header--recipe_1-0 > h1")
                //$$eval.('li.mm-recipes-structured-ingredients__list-item > p.data-ingredient-name'
                //const ingredients = await page.$$eval('.mm-recipes-structured-ingredients_1-0 > ul > li:nth-child(1) > p > span:nth-child(3) ', (elements) => {
                //    return elements.map(x => x.innerText)
                //});
                const ingredients = await page.$$eval('li.mm-recipes-structured-ingredients__list-item > p > span[data-ingredient-name="true"]', (elements) => {
                    return elements.map(x => x.innerText)
                });

                ingredient_list.set(name, ingredients);
                
                //if has more recipes in the link -> go to those
        
                //add the name and ingredients to the map
                
                //const recipeJSON = {};
                const recipeJSON = JSON.stringify(Object.fromEntries(ingredient_list))
                //for (const [key, value] of ingredient_list){
                //    recipeJSON[key] = value
               // }
                //const recipeJSON = JSON.stringify(ingredient_list);
                //const nameJSON = JSON.stringify(name, )
                //const ingredientsJSON = JSON.stringify(ingredients, null, 2)

                try {
                    await fs.appendFile("links.json", recipeJSON);
                }
                catch(err){
                    //console.error("Error: ", err);
                    console.warn(`Couldn't print to links.txt`)
                    continue;
                }
            }
        }
    

    }

   /* try{
        for (const [key, value] of ingredient_list){
            await fs.appendFile("links.txt", `${key}:  ${value.join(', ')}\n\r`);
        }
    }
    catch(err){
        //console.error("Error: ", err);
        console.warn(`Couldn't print to links.txt`)
        continue;
    }*/


    await browser.close()
    return ingredient_list; //dictionary of array?  

}


scrape();
//module.exports = {
//    scrape
//};
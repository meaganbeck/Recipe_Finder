const puppeteer = require('puppeteer')

const fs = require('fs').promises;


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

            if (extra_links || extra_links.length > 0){
                for (const extra_link in extra_links){
                    recipe_links.push(extra_links)
                }
            }
            else{
                //get the recipe name
                const name = await page.$eval('.article-header--recipe_1-0 > h1', el => el.innerText);
                //get the list of ingredients
                //document.querySelector("#article-header--recipe_1-0 > h1")
                const ingredients = await page.$$eval('.mm-recipes-structured-ingredients_1-0 > ul > li:nth-child(1) > p > span:nth-child(3) ', (elements) => {
                    return elements.map(x => x.innerText)
                    });
                ingredient_list.set(name, ingredients);
                }
 //if has more recipes in the link -> go to those
        
            //add the name and ingredients to the map
        }

    }

    for (const [key, value] of ingredient_list){
        await fs.appendFile("links.txt", `${key}:  ${value.join(', ')}\n\r`);
    }


    await browser.close()
    return ingredient_list; //dictionary of array?  

}


scrape();
//module.exports = {
//    scrape
//};
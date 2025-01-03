//indes.js handles app startup, routing and other functions

const puppeteer = require('puppeteer')
//file system 
const fs = require('fs/promises')

async function start(){
    //awaiting for puppeteer to launch. don't know how long to take
    //but it'll happen, and when it does we're ready!
    const browser = await puppeteer.launch()

    //page is a new page in the browser, 
    const page = await browser.newPage() 

    //then we go to specific website
    await page.goto("https://learnwebcode.github.io/practice-requests/")
    //await page.goto("https://www.allrecipes.com")

    //.screenshot({path: "", fullPage: true}) is taking a screenshot of this page
    //await page.screenshot({path: "my_file.png", fullPage: true})

    //extract details! 

    //take array of strings and save
    //array.join glues elements of an array into string


    //getting the names we're using
    //names = results of page.eval = document.query for .css tag .info strong
    //page.evaluate brings to browserland not node.js land
    //IT EVALUATES JS
    const names = await page.evaluate(() =>{
        //within this we do any client side js 
        //x is the .info strong that we've looped to, then gets textContent of x
        return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent)
        //change to actual array ^^
    })

    await fs.writeFile("names.txt", names.join("\r\n"))

    //could use page.evaluate again but wont
    //$$eval captures multiple elements
    //"img" is css selector
    //passes "img" it finds into the function as imgs.

    const photos = await page.$$eval("img", (imgs) => {
        return imgs.map(x => x.src)
    })

    //now loop through this array and save to comp
    for(const photo of photos){
        const imagepage = await page.goto(photo)
        await fs.writeFile(photo.split("/").pop(), await imagepage.buffer())
    }


    await browser.close()
}

start()
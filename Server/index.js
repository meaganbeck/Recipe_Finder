const express = require("express");
const app = express();

const { scrape } = require('./web_scraper');



app.use((req, res)=> {
    res.status(200).send('Hello, world!');
});

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {console.log("server running port ${PORT}"); });


let scraped_data = scrape();

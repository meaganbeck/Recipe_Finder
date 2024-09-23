const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const { scrape } = require('./web_scraper');

let scraped_data = scrape(); 
//this is all the links currently 

//this is server side handling of a get request
//change data type


//this is the response to a get request? 
app.get("/api", (req, res)=> {
    res.json({data: "hello"});
});

//this is the response to a post request
app.post("/api", (req, res) => {
    const {data} = req.body;

    res.json({success: true, response:"data received"});
    console.log({data});
});

//{data: scraped_datastuffs}

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {console.log("server running port ${PORT}"); });


/*Index file for Server side*/

const express = require("express");
const mysql = require("mysql2");
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());
const fs = require('fs').promises;

const { scrape } = require('./web_scraper');
const { parse } = require('./parse_data');
const { queryData } = require('./query_data');


/*Creates all queries I will need*/
//FIXME via updating how this data is stored. Feels like an odd strategy.

const query_empty = 'SELECT * FROM ingredients;';
const query_all = 'SELECT * FROM ingredients, recipes;';

//Variable for parsed data. The final result after filters applied. 
//FIXME likely change datatype
let processedData = {};


/*Query data to check if there is existing info in the database 
* If there is none, scrape the data. Otherwise pull all from database*/
if (queryData(query_empty) == null){
    let scraped_data = scrape(); 
}
else{
    scraped_data = queryData(query_all);  
}

//I now have all my data... in a map format? 

const PORT = process.env.PORT || 4000;

/*Response to GET request from Client */
app.get("/api/get-recipe-filtered", (req, res)=> {

    res.json({data: processedData});
});

/*Response to POST request from Cleint */
app.post("/api/recipe-filters", (req, res) => {
    /*Variable 'data' holds the sent information*/
    const {data} = req.body;
    console.log(data);
    const { ingredient, exclusion, diet } = req.body;
  
    //FIXME - call parse function that doesn't exist rn
    processedData = parse(data);

    //ALT: processedData = {ingredient, exclusion, diet, processed: true};
    console.log({processedData});
    /*Sends a response to the client, confirming it received the information.*/
    res.json({success: true, processedData: processedData, response:"data received"});

});


app.listen(PORT, () => {console.log(`server running port ${PORT}`); });

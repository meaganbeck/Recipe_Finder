import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import './Dropdown.css';
import Dropdown from "./Dropdown.js";


function App() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState("");
  //const [cuisine, setCuisine] = useState("");
  //const [ingredient, setIngredient] = useState("");
  //const [exclusion, setExclusion] = useState("");
  //const [diet, setDiet] = useState("");
  const [filters, setFilters] = useState({ingredient: '',
                                        exclusion: '',
                                        diet: ''});


/*  useEffect(() => {
    fetchData();
  }, []);
  */
//this creates a Get request that requests info
//Can use URL variable as needed
  const fetchData = () => {
    fetch('http://localhost:4000/api/get-recipe-filtered', {
      method: "GET",
    }) //This is the api endpoint (my server)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Bad response");
      }
      console.log('response received:', response);
      return response.json();
    })
    .then((data) => {
      console.log("dataaaa", data);
      //setMessage(data.message);
      setData(data);
    })
  }

  //Create a post request
  const sendData = async(data) => {
    const response = await fetch("http://localhost:4000/api/recipe-filters", {
      method: 'POST',
      headers: {
        //edit this header for the specific data i'm sending 
        "Content-type": "application/json,"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => 
      {console.log('Success:', data);
      setMessage(data.response);
      fetchData();
    })
    .catch(error => console.error('Error:', error));
  }


  //const handleSubmit() could maybe join these all into one big
 /* const handleIngredient = (value) => {
    setIngredient(value);
  }
  const handleCuisine = (value) => {
    setCuisine(value);
  }
  const handleExclusion = (value) => {
    setExclusion(value);
  }
  const handleDiet = (value) => {
    setDiet(value);
  }*/
  const handleFilters = (key, value) => {
    setFilters(prevFilter => ({
      ...prevFilter,
      [key]:value,
    }));
  };
  

  


  //maybe read from files here
  const ingredients = ['Cheese', 'Meat', 'Vegetables'];
  //const cuisines = ['Mexican', 'Korean', 'Italian'];
  const exclude = ['Dairy', 'Eggs', 'Shellfish','Tree nuts','Peanuts', 'Wheat', 'Soybeans','Nuts', 'Vegetables','Sesame', 'Fish'];
  const diets = ['Plant-Based','Vegan','Vegetarian']
  //pass food_data -> my combined ingredients and cuisines and limitations
  //<button onClick = {() => sendData("wowza")}> Find Recipe </button>
  return (
    
    <div>
      <h1 class = "h1"> Find that Recipe! </h1>
      <h2 class = "ingredient-header"> Ingredients
        <div class= "ingredient-dropdown">
          <Dropdown elements = {ingredients} onSelect ={(val) => handleFilters('ingredient', val)}/>
        </div>
      </h2>
      <h2 class = "exclude-header"> Allergies/Exclusions
        <div class = "exclude-dropdown">
          <Dropdown elements = {exclude} onSelect = {(val) => handleFilters('exclusions', val)}/>
        </div>
      </h2>
      <h2 class = "diet-header"> Special Diet
        <div class = "diet-dropdown">
          <Dropdown elements = {diets} onSelect = {(val) => handleFilters('diet', val)}/>
        </div>
      </h2>
      <button onClick = {() => sendData(filters)}> Find Recipe </button>   
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import Dropdown from "./Dropdown.js";


function App() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [exclusion, setExclusion] = useState("");

  //this creates a Get request that requests info
  const fetchData = () => {
    fetch('/api')
    .then((res) => {
      console.log('response received:', res);
      return res.json();
    })
    .then((response) => {
      console.log("dataaaa", response);
      setMessage(response.message);
      setData(response.data);
    })
    console.log(data);
  }

  //Create a post request
  const sendData = async(data) => {
    const response = await fetch("/api", {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
  }


  const handleIngredient = (value) => {
    setIngredient(value);
  }
  const handleCuisine = (value) => {
    setCuisine(value);
  }
  const handleExclusion = (value) => {
    setExclusion(value);
  }
  
  useEffect(() => {
    fetchData();
  }, []);
  

  //maybe read from files here
  const ingredients = ['Cheese', 'Meat', 'Vegetables'];
  const cuisines = ['Mexican', 'Korean', 'Italian'];
  const exclude = ['Dairy', 'Nuts', 'Vegetables'];

  //pass food_data -> my combined ingredients and cuisines and limitations
  //sendData(food_data)
  return (
    <div>
        <Dropdown elements = {ingredients} onSelect = {handleIngredient}/>
        <Dropdown elements = {cuisines} onSelect = {handleCuisine}/>
        <Dropdown elements = {exclusion} onSelect = {handleExclusion}/>
        <button onClick = {() => sendData("wowza")}> Find Recipe </button>
    </div>
  );
}

export default App;

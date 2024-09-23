import React, { useState, useEffect } from "react";
//import './App.css';

//the dropdown values are the elements of the menu
function Dropdown({elements, onSelect}) {
  const [selected, setSelected] = useState("");

    const handleChange = (event) => {
        setSelected(event.target.value);
        onSelect(event.target.value);
    };
  return (
    <select value={selected} onChange={handleChange}>
        {elements.map((option, index) => (
            <option key = {index} value ={option}> {option}</option>
        ))}
    </select>
  );


}

export default Dropdown;
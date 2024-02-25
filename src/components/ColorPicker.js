// ColorPicker.js
import React from "react";

const ColorPicker = () => {
  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    // You can use state management (e.g., useState) to update the color value in a React component
    console.log(`Selected Color: ${selectedColor}`);
  };

  return (
    <div className="popup-container">
      <h1>Simple Color Picker</h1>
      <input type="color" onChange={handleColorChange} />
      <div id="colorValue"></div>
    </div>
  );
};

export default ColorPicker;

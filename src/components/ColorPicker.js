import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [capturedCanvas, setCapturedCanvas] = useState(null);
  const capturedCanvasRef = useRef(null);

  const handlePickColorButtonClick = async () => {
    try {
      const capturedCanvas = await html2canvas(document.documentElement);
      console.log("Canvas captured");
      setCapturedCanvas(capturedCanvas);
      capturedCanvasRef.current = capturedCanvas;

      document.addEventListener("click", handleClick);
    } catch (error) {
      console.error("Error capturing HTML content:", error);
    }
  };

  const handleClick = (event) => {
    console.log("clicked anywhere on the page");
    const canvas = capturedCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const x = event.clientX;
      const y = event.clientY;
      const pixel = ctx.getImageData(x, y, 1, 1).data;

      const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      console.log("Pixel Values:", pixel[0], pixel[1], pixel[2]);
      setSelectedColor(color);

      // Remove the click event listener after capturing the click
      document.removeEventListener("click", handleClick);
    }
  };

  return (
    <>
      <div className="header-container">
        <img className="logo" src="/logo.png" alt="Logo" />
      </div>
      <div className="selected-container">
        <div className="Selected-colour">
          <h6>SELECTED COLOR</h6>
          <div
            style={{
              backgroundColor: selectedColor,
              width: "30px",
              height: "30px",
              border: "1px solid #000",
            }}
          ></div>
        </div>
        <div className="selected-hex">
          <h6>HEX</h6>
          <p>{selectedColor}</p>
        </div>
        <div className="selected-hsl">
          <h6>HSL</h6>
          {/* You can add more information here based on your requirements */}
        </div>
        <div className="selected-rgb">
          <h6>RGB</h6>
          {/* You can add more information here based on your requirements */}
        </div>
      </div>
      <div className="recent-container">
        <h6>RECENT COLORS</h6>
        {/* You can add recent colors here based on your requirements */}
      </div>
      <div className="pallete-container">
        <h6>WEBPAGE PALETTE</h6>
        {/* You can add webpage palette here based on your requirements */}
      </div>
      <button
        className="color-picker-button"
        onClick={handlePickColorButtonClick}
      >
        <h6>Pick a Color</h6>
      </button>
    </>
  );
};

export default ColorPicker;

import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isPicking, setIsPicking] = useState(false);
  const capturedCanvasRef = useRef(null);
  const [cursorColor, setCursorColor] = useState("#000000");
  const cursorSquareRef = useRef(null);

  const handlePickColorButtonClick = async () => {
    try {
      const capturedCanvas = await html2canvas(document.documentElement);
      console.log("Canvas captured");
      capturedCanvasRef.current = capturedCanvas;
      setIsPicking(true);
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

      // Disable color picking after capturing the click
      setIsPicking(false);
    }
  };

  const handleMouseMove = (event) => {
    if (isPicking) {
      const canvas = capturedCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const x = event.clientX;
        const y = event.clientY;
        const pixel = ctx.getImageData(x, y, 1, 1).data;

        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        setCursorColor(color);

        // Update the position of the cursor square
        const cursorSquare = cursorSquareRef.current;
        if (cursorSquare) {
          cursorSquare.style.left = `${event.clientX - 30}px`;
          cursorSquare.style.top = `${event.clientY - 30}px`;
        }
      }
    }
  };

  useEffect(() => {
    if (isPicking) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
    };
  }, [isPicking]);

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

      {/* Cursor square for displaying the hovered color */}
      {isPicking && (
        <div
          ref={cursorSquareRef}
          style={{
            position: "fixed",
            width: "20px",
            height: "20px",
            backgroundColor: cursorColor,
            border: "1px solid #000",
          }}
        ></div>
      )}
    </>
  );
};

export default ColorPicker;

import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState({ r: 0, g: 0, b: 0 });
  const [isPicking, setIsPicking] = useState(false);
  const capturedCanvasRef = useRef(null);
  const [cursorColor, setCursorColor] = useState({ r: 0, g: 0, b: 0 });
  const cursorSquareRef = useRef(null);
  const selectedColorHex = rgbToHex(
    selectedColor.r,
    selectedColor.g,
    selectedColor.b
  );
  const selectedColorHsl = rgbToHsl(
    selectedColor.r,
    selectedColor.g,
    selectedColor.b
  );

  const handlePickColorButtonClick = async () => {
    try {
      const capturedCanvas = await html2canvas(document.documentElement, {
        useCORS: true,
      });
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

      const color = { r: pixel[0], g: pixel[1], b: pixel[2] };
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

        const color = { r: pixel[0], g: pixel[1], b: pixel[2] };
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

  function rgbToHex(r, g, b) {
    const toHex = (value) => {
      const hex = value.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function rgbToHsl(r, g, b) {
    // Normalize RGB values to the range [0, 1]
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;

    // Find the maximum and minimum values among RGB components
    const max = Math.max(normalizedR, normalizedG, normalizedB);
    const min = Math.min(normalizedR, normalizedG, normalizedB);

    // Calculate lightness
    const lightness = ((max + min) / 2) * 100;

    // If the maximum and minimum are equal, the color is achromatic (gray)
    if (max === min) {
      return { h: 0, s: 0, l: lightness.toFixed(2) };
    }

    // Calculate saturation
    const delta = max - min;
    const saturation =
      lightness > 50
        ? (delta / (2 - max - min)) * 100
        : (delta / (max + min)) * 100;

    // Calculate hue
    let hue;
    switch (max) {
      case normalizedR:
        hue =
          ((normalizedG - normalizedB) / delta +
            (normalizedG < normalizedB ? 6 : 0)) *
          60;
        break;
      case normalizedG:
        hue = ((normalizedB - normalizedR) / delta + 2) * 60;
        break;
      case normalizedB:
        hue = ((normalizedR - normalizedG) / delta + 4) * 60;
        break;
      default:
        hue = 0;
        break;
    }

    return {
      h: hue.toFixed(2),
      s: saturation.toFixed(2),
      l: lightness.toFixed(2),
    };
  }
  const handleCopyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
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
      <div className="body-container">
        <div className="selected-color">
          <h6>SELECTED COLOR</h6>
          <div
            className="selected-color-box"
            style={{
              backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
            }}
          ></div>
        </div>

        <div className="selected-hex">
          <h6>HEX</h6>
          <div className="selected-hex-boxes">
            <button
              className="display left"
              onClick={() =>
                handleCopyToClipboard(selectedColorHex.toUpperCase().toString())
              }
            >
              {selectedColorHex}
            </button>
            <button
              className="display"
              onClick={() => handleCopyToClipboard(selectedColorHex)}
            >
              {selectedColorHex}
            </button>
          </div>
        </div>
        <div className="selected-hsl">
          <h6>HSL</h6>
          <button
            className="display"
            onClick={() => handleCopyToClipboard(selectedColorHex)}
          >
            hsl({selectedColorHsl.h}, {selectedColorHsl.s}%,{" "}
            {selectedColorHsl.l}
            %)
          </button>
        </div>
        <div className="selected-rgb">
          <h6>RGB</h6>
          <button className="display" onClick={() => handleCopyToClipboard}>
            rgb({selectedColor.r},{selectedColor.g},{selectedColor.b})
          </button>
        </div>

        <div className="recent-container">
          <div className="recent-header">
            <h6>RECENT COLORS</h6>
            <button className="clear">
              <h6>CLEAR</h6>
            </button>
          </div>
          <div className="color-discs">
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
          </div>
        </div>
        <div className="palette-container">
          <div className="palette-header">
            <h6>WEBPAGE PALETTE</h6>
          </div>
          <div className="color-discs">
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
            <button className="recent-color"></button>
          </div>
          {/* You can add webpage palette here based on your requirements */}
        </div>
        <button
          className="color-picker-button"
          onClick={handlePickColorButtonClick}
        >
          <span className="pick-color-text">PICK COLOR</span>
        </button>
      </div>

      {/* Cursor square for displaying the hovered color */}
      {isPicking && (
        <div
          ref={cursorSquareRef}
          style={{
            position: "fixed",
            width: "20px",
            height: "20px",
            backgroundColor: `rgb(${cursorColor.r}, ${cursorColor.g}, ${cursorColor.b})`,
            border: "1px solid #000",
          }}
        ></div>
      )}
    </>
  );
};

export default ColorPicker;

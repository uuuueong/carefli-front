import React, { useState } from "react";
import "./DynamicButton.css"; // Make sure the CSS file name matches the import statement

function DynamicButtons({ buttonsData, onButtonClick, onButtonDeselect }) {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (text) => {
    setSelectedButton(text);
    onButtonClick(text);
  };

  const handleDeselect = (event, text) => {
    event.stopPropagation(); // Prevents the button click event from firing
    if (selectedButton === text) {
      setSelectedButton(null); // Deselect if it's the currently selected button
    }
    onButtonDeselect();
  };

  return (
    <div className="dynamic-buttons-container">
      {buttonsData.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.text)}
          className={`dynamic-button ${selectedButton === button.text ? "selected" : ""}`}
        >
          {button.text}
          {selectedButton === button.text && (
            <span className="close-mark" onClick={(e) => handleDeselect(e, button.text)}>
              ×
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default DynamicButtons;

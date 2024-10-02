import React, { useState } from "react";
import "./DynamicButton.css";

function DynamicButtons({ buttonsData }) {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (action) => {
    setSelectedButton(action);
  };

  const handleDeselect = (event, action) => {
    event.stopPropagation(); // Prevents the button click event from firing
    if (selectedButton === action) {
      setSelectedButton(null);
    }
  };

  return (
    <div className="dynamic-buttons-container">
      {buttonsData.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.action)}
          className={`dynamic-button ${selectedButton === button.action ? "selected" : ""}`}
        >
          {button.text}
          {selectedButton === button.action && (
            <span className="close-mark" onClick={(e) => handleDeselect(e, button.action)}>
              ×
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default DynamicButtons;

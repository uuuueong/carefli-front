import React, { useState } from "react";
import "./DynamicButton.css"; // Make sure the CSS file name matches the import statement.

function DynamicButtons({ buttonsData, onButtonClick, onButtonDeselect, multipleSelect = "single" }) {
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleButtonClick = (text) => {
    if (multipleSelect === "multiple") {
      if (selectedButtons.includes(text)) {
        setSelectedButtons(selectedButtons.filter((button) => button !== text));
        onButtonDeselect(text);
      } else {
        setSelectedButtons([...selectedButtons, text]);
        onButtonClick(text);
      }
    } else {
      // 'single' mode
      if (selectedButtons.includes(text)) {
        setSelectedButtons([]);
        onButtonDeselect(text);
      } else {
        setSelectedButtons([text]);
        onButtonClick(text);
      }
    }
  };

  const isSelected = (text) => selectedButtons.includes(text);

  return (
    <div className="dynamic-buttons-container">
      {buttonsData.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.text)}
          className={`dynamic-button ${isSelected(button.text) ? "selected" : ""}`}
        >
          {button.text}
          {isSelected(button.text) && (
            <span
              className="close-mark"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the button click event from firing again
                handleButtonClick(button.text); // Toggle selection off
              }}
            >
              ×
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default DynamicButtons;

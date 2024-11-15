import React, { useState, useEffect } from "react";
import "./DynamicButton.css"; // Make sure the CSS file name matches the import statement

function DynamicButtons({
  buttonsData,
  onButtonClick,
  onButtonDeselect,
  multipleSelect = "single",
  selectedCategories = [],
}) {
  const [selectedButtons, setSelectedButtons] = useState([]);

  useEffect(() => {
    setSelectedButtons(selectedCategories);
  }, [selectedCategories]);

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
          type="button"
          key={index}
          onClick={() => handleButtonClick(button.text)}
          className={`dynamic-button ${isSelected(button.text) ? "selected" : ""}`}
        >
          {button.text}
          {isSelected(button.text) && (
            <span
              className="close-mark"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick(button.text);
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

import React from "react";
import "./AlertModal.css";

const AlertModal = ({ message, onClose }) => {
  return (
    <div className="alert-overlay">
      <div className="alert-modal">
        <p>{message}</p>
        <button className="button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;

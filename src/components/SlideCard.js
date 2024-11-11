import React from 'react';
import './HistoryCard.css'; 

function SlideCard({ onClose }) {
  return (
    <div className="slide-card">
      <div className="slide-card-content">
        <div className="slide-card-header">
          <h4>선물 LIST</h4>
          <button className="slide-card-close-button" onClick={onClose}>X</button>
        </div>
        <div className="slide-card-body">
          <img className="gift-image" src="선물 이미지" alt="gift" />
          <h5>선물 브랜드</h5>
          <p>선물 이름</p>
          <p className="slide-card-price">22,500원</p>
        </div>
        <br></br>
        <a href="#" className="slide-card-gift-link">선물링크 바로가기</a>
      </div>
    </div>
  );
}

export default SlideCard;

import React from 'react';
import './HistoryCard.css';
import { useState } from 'react';
import SlideCard from './SlideCard';

function HistoryCard() {

    const [showSlideCard, setShowSlideCard] = useState(false);

    const openSlideCard = () => setShowSlideCard(true);
    const closeSlideCard = () => setShowSlideCard(false);


  return (
    <div className="history-card">
      <h3>선물 🎁</h3>
      <button className="add-button" onClick={openSlideCard}>+</button>
      
      {showSlideCard && <SlideCard onClose={closeSlideCard} />}

      <div className="history-card-content">
        <img></img>
        <p><strong>날짜:</strong> 24.11.09 (토)</p>
        <p><strong>선물 이름:</strong> 스타벅스 2만원 기프티콘</p>
        <p><strong>금액:</strong> 20000원</p>

        <div className="history-card-button-group">
          <button>선물 바로가기</button>
        </div>
      </div>

     
    </div>
  );
}

export default HistoryCard;

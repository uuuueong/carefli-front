import React from 'react';
import './HistoryCard.css';
import { useState } from 'react';

function HistoryCard() {

  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setShowModal(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => setShowModal(false), 300); // 애니메이션 시간과 동일하게 설정
  };


  return (
    <div className="history-card">
      <h3>선물 🎁</h3>
      <button className="add-button" onClick={openModal}>+</button>

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

import React from 'react';
import './HistoryCard.css';
import { useState } from 'react';
import SlideCard from './SlideCard';

function HistoryCard({ history = [] }) {
  const [showSlideCard, setShowSlideCard] = useState(false);

  const openSlideCard = () => setShowSlideCard(true);
  const closeSlideCard = () => setShowSlideCard(false);

  if (history.length === 0) {
    return <p>추천 히스토리가 없습니다.</p>;
  }

  return (
    <div className="history-card">
      <h3>추천 히스토리 🎁</h3>
      <button className="add-button" onClick={openSlideCard}>+</button>
      {showSlideCard && <SlideCard onClose={closeSlideCard} />}

      {history.map((item) => (
        <div key={item.recommendationSetId} className="history-card-content">
          <p><strong>날짜:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
          <p><strong>기념일:</strong> {item.occasionType}</p>
          <h4>추천 선물 목록:</h4>
          <ul>
            {item.recommendedGifts.map((gift) => (
              <li key={gift.giftId} style={{ marginBottom: '10px' }}>
                <p><strong>선물 이름:</strong> {gift.giftName}</p>
                <p><strong>금액:</strong> {gift.price.toLocaleString()}원</p>
                <img
                  src={gift.giftImageUrl}
                  alt={gift.giftName}
                  style={{ width: '100px', borderRadius: '5px', marginBottom: '10px' }}
                />
                <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer">
                  <button className="gift-link-button">선물 바로가기</button>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default HistoryCard;

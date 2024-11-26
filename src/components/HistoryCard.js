// deprecated file
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistoryCard.css";
import SlideCard from "./SlideCard";

function HistoryCard({ connectionId }) {
  const [showSlideCard, setShowSlideCard] = useState(false);
  const [recommendations, setRecommendations] = useState([]); // 추천 히스토리 데이터 배열
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openSlideCard = () => setShowSlideCard(true);
  const closeSlideCard = () => setShowSlideCard(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!connectionId) {
        setError("Connection ID가 유효하지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://api.carefli.p-e.kr/gifts/recommendations/${connectionId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data && response.data.length > 0) {
          const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRecommendations(sortedData);
        } else {
          setRecommendations([]);
          setError("추천 히스토리가 없습니다.");
        }
      } catch (err) {
        console.error("추천 히스토리를 가져오는 중 오류 발생:", err);
        setError("추천 히스토리를 가져오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [connectionId]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="history-card">
      <h3>추천 히스토리 🎁</h3>
      <button className="add-button" onClick={openSlideCard}>
        +
      </button>
      {showSlideCard && <SlideCard onClose={closeSlideCard} />}

      {recommendations.length === 0 ? (
        <p>추천 히스토리가 없습니다.</p>
      ) : (
        recommendations.map((item) => (
          <div key={item.recommendationSetId} className="history-card-content">
            <p>
              <strong>추천 ID:</strong> {item.recommendationSetId}
            </p>
            <p>
              <strong>날짜:</strong> {new Date(item.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>기념일:</strong> {item.occasionType}
            </p>
            <h4>추천 선물 목록:</h4>
            <ul>
              {item.recommendedGifts.map((gift) => (
                <li key={gift.giftId} style={{ marginBottom: "10px" }}>
                  <p>
                    <strong>선물 이름:</strong> {gift.giftName}
                  </p>
                  <p>
                    <strong>금액:</strong> {gift.price.toLocaleString()}원
                  </p>
                  <img
                    src={gift.giftImageUrl}
                    alt={gift.giftName}
                    style={{ width: "100px", borderRadius: "5px", marginBottom: "10px" }}
                  />
                  <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer">
                    <button className="gift-link-button">선물 바로가기</button>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryCard;

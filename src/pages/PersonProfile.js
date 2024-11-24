import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SpinnerFull from "../components/SpinnerFull";
import defaultImage from "../image/profileDefault.png";

function PersonProfile() {
  const { connectionId } = useParams();
  const [profile, setProfile] = useState(null);
  const [likedGifts, setLikedGifts] = useState([]);
  const [savedMessages, setSavedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(
          `https://api.carefli.p-e.kr/connections/${connectionId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setProfile(response.data);
      } catch (err) {
        console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [connectionId]);

  useEffect(() => {
    const fetchLikedGifts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(
          `https://api.carefli.p-e.kr/gifts/like?connectionId=${connectionId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setLikedGifts(response.data);
      } catch (err) {
        console.error("좋아요한 선물을 가져오는 데 실패했습니다.", err);
        setError("좋아요한 선물을 가져오는 데 실패했습니다.");
      }
    };

    fetchLikedGifts();
  }, [connectionId]);


  if (loading) {
    return <SpinnerFull />;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!profile) {
    return <h2>해당 인물을 찾을 수 없습니다.</h2>;
  }

  const handleGiftClick = () => {
    navigate("/present", { state: { profile } });
  };

  const handleTextClick = () => {
    navigate("/Writing", { state: { profile } });
  };

  const getInterestTags = (interestTags) => {
    return interestTags
      ?.split(/[-/]/)
      .slice(0, 3)
      .map((tag) => `#${tag}`);
  };

  return (
    <div style={styles.container}>
      <h1>{profile.connectionName}의 프로필</h1>
      <div style={styles.scrollableSection}>
        <div style={styles.profileCard}>
          <div style={styles.profileText}>
            <h3>
              나의 {profile.relationship}, {profile.connectionName}
            </h3>
            <p>등록일: {profile.createdAt.split("T")[0]}</p>
          </div>
          <img
            src={profile.connectionImageUrl ? profile.connectionImageUrl : defaultImage}
            alt="Profile"
            style={styles.profileImage}
          />
        </div>

        <h3 style={styles.sectionHeader}>
          {profile.connectionName}님의 관심사는?
        </h3>
        <p style={{ color: "gray" }}>{getInterestTags(profile?.interestTag).join(" ")}</p>

        <h3 style={styles.sectionHeader}>좋아요한 선물 목록 🎁</h3>
        
        <div className="liked-gifts">
          {likedGifts.length > 0 ? (
            likedGifts.map((gift) => (
              <div key={gift.giftId} style={styles.giftCard}>
                <div style={styles.giftDetails}>
                  <p>
                    <strong>선물 이름:</strong>
                  </p>
                  <p>{gift.giftName}</p>
                  <p>
                    <strong>금액:</strong>
                  </p>
                  <p>{gift.price.toLocaleString()}원</p>
                </div>
                <div style={styles.giftImageContainer}>
                  <img
                    src={gift.giftImageUrl}
                    alt={gift.giftName}
                    style={styles.giftImage}
                  />
                </div>
                <div style={styles.buttonContainer}>
                  <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer">
                    <button style={styles.saveButton}>선물 바로가기</button>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>좋아요한 선물이 없습니다.</p>
          )}
        </div>



      </div>

      <div className="button-group">
        <button className="button" onClick={handleGiftClick}>
          선물하기
        </button>
        <button className="button" onClick={handleTextClick}>
          문구 생성하기
        </button>
      </div>

    </div>
  );
}

const styles = {
  giftCard: {
    display: "flex",
    flexDirection: "column", // 세로 정렬로 변경
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    textAlign: "left",
    width: "90%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  giftDetails: {
    textAlign: "left",
    marginBottom: "15px", // 이미지와 간격 추가
    width: "100%",
  },
  giftImageContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  giftImage: {
    width: "100px",
    height: "100px",
    borderRadius: "5px",
    objectFit: "cover",
    marginBottom: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  saveButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default PersonProfile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SpinnerFull from "../components/SpinnerFull";
import defaultImage from "../image/profileDefault.png";

function MessageCard({ message }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div style={styles.messageCard}>
      <p><strong>상황:</strong> {message.occasionType}</p>
      <p><strong>날짜:</strong> {new Date(message.createdAt).toLocaleDateString()}</p>
      <p>
        <strong>문구:</strong>{" "}
        {isExpanded ? message.text : `${message.text.slice(0, 50)}...`}
      </p>
      <button onClick={handleToggle} style={styles.detailsButton}>
        {isExpanded ? "간략히 보기" : "상세보기"}
      </button>
    </div>
  );
}

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(
          `https://api.carefli.p-e.kr/messages/history/${connectionId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setSavedMessages(response.data);
      } catch (err) {
        console.error("저장된 문구를 가져오는 데 실패했습니다.", err);
        setError("저장된 문구를 가져오는 데 실패했습니다.");
      }
    };

    fetchMessages();
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
                <p><strong>선물 이름:</strong> {gift.giftName}</p>
                <p><strong>금액:</strong> {gift.price.toLocaleString()}원</p>
                <img
                  src={gift.giftImageUrl}
                  alt={gift.giftName}
                  style={{ width: "100px", borderRadius: "5px", marginBottom: "10px" }}
                />
                <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer">
                  <button className="gift-link-button">선물 바로가기</button>
                </a>
              </div>
            ))
          ) : (
            <p>좋아요한 선물이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    padding: "20px",
  },
  scrollableSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    overflowY: "scroll",
    height: "570px",
  },
  profileCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "10px",
    width: "90%",
    marginBottom: "10px",
  },
  profileText: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "5px",
  },
  profileImage: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
  },
  sectionHeader: {
    display: "inline-block",
    borderBottom: "2px solid #555",
    paddingBottom: "5px",
  },
  giftCard: {
    display: "flex",
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
  messageCard: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "15px",
    textAlign: "left",
    width: "90%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  detailsButton: {
    marginTop: "10px",
    padding: "5px 10px",
    borderRadius: "5px",
    backgroundColor: "#f8f8f8",
    border: "1px solid #ddd",
    cursor: "pointer",
  },
};

export default PersonProfile;
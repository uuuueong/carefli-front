import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SpinnerFull from "../components/SpinnerFull";
import defaultImage from "../image/profileDefault.png";
  import { CopyToClipboard } from "react-copy-to-clipboard";

function PersonProfile() {
  const { connectionId } = useParams();
  const [profile, setProfile] = useState(null);
  const [likedGifts, setLikedGifts] = useState([]);
  const [savedMessages, setSavedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`https://api.carefli.p-e.kr/connections/${connectionId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProfile(response.data);
      } catch (err) {
        console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
        // setError(err);
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

        if (!connectionId) {
          console.warn("connectionId가 없습니다. 좋아요한 선물 API 호출을 중단합니다.");
          return; // connectionId가 없으면 API 호출 중단
        }

        const likedgift_response = await axios.get(
          `https://api.carefli.p-e.kr/gifts/like?connectionId=${connectionId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setLikedGifts(likedgift_response.data);
      } catch (err) {
        console.error("좋아요한 선물을 가져오는 데 실패했습니다.", err);
      }
    };

    fetchLikedGifts();
  }, [connectionId]);

  useEffect(() => {
    const fetchSavedMessages = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!connectionId) {
          console.warn("connectionId가 없습니다. 저장된 문구 API 호출을 중단합니다.");
          return; // connectionId가 없으면 API 호출 중단
        }
        console.log(accessToken);
        const savedText_response = await axios.get(`https://api.carefli.p-e.kr/messages/history/${connectionId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSavedMessages(savedText_response.data);
      } catch (err) {
        console.error("저장된 문구를 가져오는 데 실패했습니다.", err);
      }
    };

    fetchSavedMessages();
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

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 800); // 0.8초 후에 "복사 완료" 숨기기
  };

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
      {/* 프로필 텍스트와 이미지의 가로 정렬 */}
      <div style={styles.profileRow}>
        <div style={styles.profileText}>
          <h3 style={{ lineHeight: "1.5" }}>
            나의 {profile.relationship.length >= 4 ? (
              <>
                {profile.relationship},  <br />
              </>
              ) : (
                `${profile.relationship}, `
              )}
                {profile.connectionName}
          </h3>

        {/* <p>등록일: {profile.createdAt.split("T")[0]}</p> */}
        <p>생일: {profile.birthday}</p>
      </div>
      <img
        src={profile.connectionImageUrl ? profile.connectionImageUrl : defaultImage}
        alt="Profile"
        style={styles.profileImage}
      />
    </div>
  
    <div style={styles.buttonGroup}>
      <button className="button" onClick={handleGiftClick}>
        선물하기 🎁
      </button>
      <button className="button" onClick={handleTextClick}>
        문구 생성하기 📝
      </button>
    </div>
  </div>


        <h3 style={styles.sectionHeader}>{profile.connectionName}님의 관심사는?</h3>
        {/* <p style={{ color: "gray" }}>{getInterestTags(profile?.interestTag).join(" ")}</p>*/}
        <div style={styles.tagContainer}>
          {getInterestTags(profile?.interestTag).map((tag, index) => (
            <span key={index} style={styles.tagBubble}>
              {tag}
            </span>
          ))}
        </div>

        <h3 style={styles.sectionHeader}>{profile.connectionName}님의 MBTI는?</h3>
        {/* <p style={{ color: "gray" }}>{getInterestTags(profile?.mbti).join(" ")}</p> */}
        <span style={styles.tagBubble}>{profile.mbti}</span>

        <h3 style={styles.sectionHeader}>추천 History </h3>

        <div className="liked-gifts">
          {likedGifts?.length > 0 &&
            likedGifts.map((gift) => (
              <div key={gift.giftId} style={styles.giftCard}>
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
                  <button className="button">선물 바로가기</button>
                </a>
              </div>
            ))}
          {savedMessages?.length > 0 &&
            savedMessages.map((message) => (
              <div key={message.messageId} style={styles.giftCard}>
                <p>
                  <strong>이벤트:</strong> {message?.occasionType}
                </p>
                <p>{message?.content}</p>
                <CopyToClipboard text={message?.content} onCopy={handleCopy}>
                  <button className="button">복사하기</button>
                </CopyToClipboard>
                {copied && <div style={styles.tooltip}>복사 완료!</div>}
              </div>
            ))}
          {likedGifts?.length == 0 && savedMessages == 0 && <p>선물 추천/문구 생성 기록이 없습니다.</p>}
        </div>
      </div>
      <div
        style={{
          height: "10vh",
        }}
      >
        
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
    height: "77vh",
    overflowY: "scroll",
    // height: "570px",
  },
  profileCard: {
    display: "flex",
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    width: "300px", // 카드의 고정 너비
    margin: "20px auto", // 화면 가운데 정렬
  },
  profileRow: {
    display: "flex", 
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "space-between", 
    width: "100%", 
  },
  profileText: {
    flex: 1, // 텍스트가 이미지를 밀지 않도록 공간 확보
    textAlign: "center", 
    marginRight: "10px", 
  },
  profileImage: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
  },
  sectionHeader: {
    display: "inline-block",
    borderBottom: "2px solid #555",
    paddingBottom: "5px",
  },

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
  buttonGroup: {
    display: "flex", 
    gap: "15px", 
    marginTop: "2px", 
    width: "100%", // 버튼 그룹의 너비를 카드와 맞춤
    alignItems: "center", 
    justifyContent: "center",
  },
  saveButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  tagContainer: {
    display: "flex", 
    flexWrap: "wrap", 
    gap: "12px",
    marginTop: "5px",
  },
  tagBubble: {
    display: "inline-block", 
    padding: "6px 10px", 
    backgroundColor: "#f0f0f0", 
    color: "#333", 
    borderRadius: "20px", 
    fontSize: "15px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },
  tooltip: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80px",
    height: "20px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px", 
    backgroundColor: "#4a4c4b",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "14px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
    textAlign: "center",
  },
  tooltipShow: {
    opacity: 1, 
  },
};

export default PersonProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SpinnerFull from "../components/SpinnerFull";
import defaultImage from "../image/profileDefault.png";
import HistoryCard from "../components/HistoryCard";

function PersonProfile() {
  const { connectionId } = useParams(); // URL의 파라미터에서 id를 가져옴
  const [profile, setProfile] = useState(null); // 프로필 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

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

        setProfile(response.data); // 서버에서 받은 데이터를 상태로 저장
        setLoading(false); // 로딩 완료
      } catch (err) {
        console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
        setError(err);
        setLoading(false); // 로딩 완료
      }
    };

    fetchProfile(); // 컴포넌트가 렌더링될 때 서버에서 프로필 데이터 가져옴
  }, [connectionId]);

  if (loading) {
    return <SpinnerFull />;
  }

  if (error) {
    return <h2>프로필 데이터를 가져오는 중 오류가 발생했습니다.</h2>;
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
      ?.split(/[-/]/) // '-'와 '/' 구분자를 기준으로 분리
      .slice(0, 3) // 상위 3개만 선택
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

        <h3 style={styles.sectionHeader}>
          {profile.connectionName}님은 어떤 분인가요?
        </h3>
        <p>생일: {profile.birthday}</p>
        <p>MBTI: {profile.mbti}</p>

        <h3 style={styles.sectionHeader}>추천 History</h3>
        <HistoryCard connectionId={connectionId} /> {/* HistoryCard와 연결 */}
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
};

export default PersonProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SpinnerFull from "../components/\bSpinnerFull";
import defaultImage from "../image/profileDefault.png"

function PersonProfile() {
  const { connectionId } = useParams(); // URL의 파라미터에서 id를 가져옴
  const [profile, setProfile] = useState(null); // 프로필 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  
  useEffect(() => {
    // 서버에서 프로필 데이터를 가져오는 함수
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        // console.log("Access Token:", accessToken);
        // console.log("Connection ID:", connectionId);

        const response = await axios.get(`https://api.carefli.p-e.kr/connections/${connectionId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

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

  // 로딩 상태 처리
  if (loading) {
    return <SpinnerFull />;
  }

  // 오류 상태 처리
  if (error) {
    return <h2>프로필 데이터를 가져오는 중 오류가 발생했습니다.</h2>;
  }

  // 프로필이 없을 때 처리
  if (!profile) {
    return <h2>해당 인물을 찾을 수 없습니다.</h2>;
  }

  // 선물하기 버튼 클릭 핸들러
  const handleGiftClick = () => {
    // 프로필 데이터를 포함하여 '/present'로 이동
    navigate("/present", { state: { profile } });
  };

  // 문구 생성하기 버튼 클릭 핸들러
  const handleTextClick = () => {
    // 필요한 다른 경로로 이동할 수도 있음
    navigate("/Writing", { state: { profile } });
  };



  return (
    <div style={styles.container}>
      <h1>{profile.connectionName}의 프로필</h1>
      {/* 이미지가 있을 경우 표시 
      {profile.profileImage && (
        <img src={profile.profileImage} alt={`${profile.name}'s profile`} style={styles.image} />
      )} */}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "10px",
            width: "100%",
            marginBottom: "10px",
          }}
        >
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
        <h2> 나의 {profile.relationship}, {profile.connectionName} </h2>
        <p> 등록일: {profile.createdAt.split('T')[0]} </p>
          </div>

        <img
          src={defaultImage}
          alt="defaultimg"
          style={{ width: "110px", height: "110px", borderRadius: "50%" }}
          />
        </div>

      <h3>{profile.connectionName}님의 관심사는?</h3>
      <p style = {{ color: "gray" }} > 현재 제작 중 .. ⚙️ </p>
      <h3>{profile.connectionName}님은 어떤 분인가요?</h3>

      <p>생일: {profile.birthday}</p>
      <p>MBTI: {profile.mbti}</p>

      <h3>추천 History</h3>
      <p style = {{ color: "gray" }} > 현재 제작 중 .. 🛠️ </p>

    </div>
      

      {/* <p>관계: {profile.relationship}</p>
      <p>등록일: {profile.createdAt}</p>
      <p>생일: {profile.birthday}</p>
      <p>MBTI: {profile.mbti}</p> */}
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
    flexDirection: "column", // 수직 정렬
    alignItems: "center", // 수평 중앙 정렬
    height: "100vh",
    backgroundColor: "#f9f9f9",
    textAlign: "center", // 텍스트도 중앙 정렬
    padding: "20px", // 콘텐츠 여백
  },

  image: {
    display: "block",
    width: "150px",
    height: "150px",
    borderRadius: "50%", // 원형 이미지
    objectFit: "cover", // 이미지가 원형으로 잘리더라도 비율 유지
    marginBottom: "20px", // 이미지랑 텍스트 사이의 간격
  },
};

export default PersonProfile;

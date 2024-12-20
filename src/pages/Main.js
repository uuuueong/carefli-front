import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Main.css";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import defaultImage from "../image/profileDefault.png";

const Main = () => {
  const [profiles, setProfiles] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 390); // 화면 크기 상태
  const [hasSearched, setHasSearched] = useState(false); // 검색 여부
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 화면 크기 변화 감지
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 390);
    };

    window.addEventListener("resize", handleResize);

    // 나의 정보 조회
    const fetchMe = () => {
      const accessToken = localStorage.getItem("accessToken");
      axios
        .get(`https://api.carefli.p-e.kr/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          localStorage.setItem("user", JSON.stringify(response.data));
        })
        .catch((err) => {
          console.error("내 데이터를 가져오는 데 실패했습니다.", err);
        });
    };

    // 인맥 리스트 조회
    const fetchProfiles = () => {
      const cachedProfiles = localStorage.getItem("profiles");
      const accessToken = localStorage.getItem("accessToken");
      if (cachedProfiles) {
        setProfiles(JSON.parse(cachedProfiles));
      }

      axios
        .get(`https://api.carefli.p-e.kr/connections`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          localStorage.setItem("profiles", JSON.stringify(response.data));
          setProfiles(response.data);
        })
        .catch((err) => {
          console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
        });
    };

    fetchProfiles();
    fetchMe();

    return () => window.removeEventListener("resize", handleResize); // 이벤트 클린업
  }, []);

  // 인물 등록 페이지로 이동
  const handleEnrollClick = () => {
    navigate("/person-enroll");
  };

  // 특정 인물의 페이지로 이동
  const handlePersonClick = (connectionId) => {
    navigate(`/connections/${connectionId}`); // '/person/:id' 경로로 이동
  };

  const handleSearchResults = (query) => {
    setHasSearched(true); // 검색 수행 여부를 true로 설정
    setSearchQuery(query); // 검색어 업데이트
  };

  const renderProfileCard = (profile) => (
    <div
      key={profile.connectionId}
      className="profileCard"
      onClick={() => handlePersonClick(profile.connectionId)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p> </p>
      <img
        src={profile.connectionImageUrl ? profile.connectionImageUrl : defaultImage} // 프로필 이미지가 있으면 표시, 없으면 기본 이미지
        alt="profile"
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          margin: "-6px",
          marginTop: "2px",
        }}
      />
      <h2>{profile.connectionName}</h2>
      <div
        className={`bubble-container ${
          profile.relationship.length >= 4 ? "vertical-layout" : "horizontal-layout"
        }`}
      >
        <span className={`mbti-bubble ${profile.mbti}`}>{profile.mbti}</span>
        <span className="relationship-bubble">{profile.relationship}</span>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ overflowY: "auto", paddingRight: "15px", minWidth: "240px" }}>
      <header className="header">
        {/* 동적으로 텍스트 변경 */}
        <h1>
          {isSmallScreen ? (
            <>
              인맥 <br /> 모음.zip
            </>
          ) : (
            "인맥 모음.zip"
          )}
        </h1>
        {/* 동적으로 버튼 텍스트 변경 */}
        <button className="enrollButton" onClick={handleEnrollClick}>
          {isSmallScreen ? (
            <>
              인물 <br /> 등록하기
            </>
          ) : (
            "인맥 등록하기"
          )}
        </button>
      </header>

      <hr />
      <div>
        <SearchBar onSearchResults={handleSearchResults} />
      </div>


      <section className="profileList">
        {hasSearched ? (
          searchQuery.length > 0 ? (
            searchQuery.slice().reverse().map((profile) => renderProfileCard(profile))
            ) : (
                <p>검색 결과가 없습니다.</p>
                )
            ) : (
                profiles.slice().reverse().map((profile) => renderProfileCard(profile))
            )}
      </section>

    </div>
  );
};

export default Main;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Main.css";
import axios from "axios";
import SearchBar from "../components/SearchBar";

const Main = () => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const { connectionId } = useParams(); // URL에서 connectionId 추출해옴
  const handleSearch = (query) => {
    console.log("검색어: ", query);
  };

  useEffect(() => {
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
      if (cachedProfiles) {
        setProfiles(JSON.parse(cachedProfiles));
      } else {
        const accessToken = localStorage.getItem("accessToken");
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
      }
    };
    fetchProfiles();
    fetchMe();
  }, []);

  // 인물 등록 페이지로 이동
  const handleEnrollClick = () => {
    navigate("/person-enroll");
  };

  // 특정 인물의 페이지로 이동
  const handlePersonClick = (connectionId) => {
    navigate(`/connections/${connectionId}`); // '/person/:id' 경로로 이동
  };

  return (
    <div className="container" style={{ overflowY: "auto", paddingRight: "15px" }}>
      <header className="header">
        <h1>인맥 모음.zip</h1>
        <button className="enrollButton" onClick={handleEnrollClick}>
          인맥 등록하기
        </button>
      </header>

      <hr />
      <div>
        <SearchBar onSearch={handleSearch} />
      </div>

      <br />

      <section className="profileList">
        {profiles.length > 0 ? (
          profiles.map((profile, index) => (
            <div
              key={index} // 인덱스를 키로 사용
              className="profileCard"
              onClick={() => handlePersonClick(profile.connectionId)} // 프로필 페이지로 이동
            >
              <h2>{profile.connectionName}</h2>
              <p>{profile.relationship}</p> {/* description 대신 relationship 표시 */}
              <p>{profile.birthday}</p> {/* 생일 추가 표시 */}
            </div>
          ))
        ) : (
          <p>등록된 인물이 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default Main;

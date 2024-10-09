import React, { useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import "./Main.css";
import axios from "axios";

const Main = () => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 프로필 데이터를 가져오는 함수
    const fetchProfiles = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        console.log("Access Token:", accessToken);

        const response = await axios.get("https://api.carefli.p-e.kr/connections", {
          headers: {
            "Authorization": `Bearer ${accessToken}`, // 인증을 위해 토큰을 헤더에 포함
          },
        });

        setProfiles(response.data); // 서버에서 가져온 프로필 데이터를 상태에 저장
        console.log("Profiles loaded:", response.data);
      } catch (error) {
        console.error("프로필 데이터를 가져오는 데 실패했습니다.", error);
      }
    };

    fetchProfiles(); // 컴포넌트가 렌더링될 때 프로필 데이터를 서버에서 가져옴
  }, []);

   // 인물 등록 페이지로 이동
   const handleEnrollClick = () => {
    navigate("/person-enroll");
  };

  // 특정 인물의 페이지로 이동
  const handlePersonClick = (id) => {
    navigate(`/person/${id}`); // '/person/:id' 경로로 이동
  };


  return (
    <div className="container">
      <header className="header">
        <h1>인맥 모음.zip</h1>
        <button className="enrollButton" onClick={handleEnrollClick}>
          인맥 등록하기
        </button>
      </header>

      <section className="profileList">
        {profiles.length > 0 ? (
          profiles.map((profile, index) => (
            <div
              key={index} // 인덱스를 키로 사용
              className="profileCard"
              onClick={() => handlePersonClick(index + 1)} // 프로필 페이지로 이동
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

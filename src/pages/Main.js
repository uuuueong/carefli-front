import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const [profiles, setProfiles] = useState([]); // 인물 프로필 목록 상태 관리
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 localStorage에서 인물 데이터를 불러옴
  useEffect(() => {
    const storedProfiles = JSON.parse(localStorage.getItem('people')) || [];
    setProfiles(storedProfiles); // 상태에 저장된 프로필을 업데이트
  }, []);

  // 인물 등록 페이지로 이동
  const handleEnrollClick = () => {
    navigate('/person-enroll');
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
              key={index}  // 인덱스를 키로 사용
              className="profileCard"
              onClick={() => handlePersonClick(index + 1)} // 프로필 페이지로 이동
            >
              <h2>{profile.name}</h2>
              <p>{profile.relationship}</p> {/* description 대신 relationship 표시 */}
              <p>{profile.birthday}</p>  {/* 생일 추가 표시 */}
            </div>
          ))
        ) : (
          <p>등록된 인물이 없습니다.</p>
        )}
      </section>
    </div>
  );
}

export default Main;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

// 샘플 인물 데이터 (PersonEnroll.js에서 받아오는 실제 데이터를 사용하도록 수정 필요)
const initialProfiles = [
  { id: 1, name: '손윤지', description: '인물에대한간략정보1' },
  { id: 2, name: '정이진', description: '인물에대한간략정보2' },
  { id: 3, name: '정지은', description: '인물에대한간략정보3' },
  { id: 4, name: '김이화', description: '인물에대한간략정보4' },
];

function Main() {
  const [profiles] = useState(initialProfiles); // 인물 프로필 목록 관리
  const navigate = useNavigate();

  // 인물 등록 페이지로 이동
  const handleEnrollClick = () => {
    navigate('/person-enroll'); // '/person-enroll' 경로는 PersonEnroll.js에 맞게 설정
  };

   // 특정 인물의 페이지로 이동, 현재는 person_1 -> 손윤지 페이지만
   const handlePersonClick = (id) => {
    navigate(`/person/${id}`); // '/person/:id' 경로로 이동, 해당 인물의 id를 전달
  };

  return (
    <div className="container">
      <header className="header">
        <h1>인맥 모음.zip</h1>
        <button className="enrollButton" onClick={() => navigate('/person-enroll')}>
          인맥 등록하기
        </button>
      </header>
      
      <section className="profileList">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="profileCard"
              onClick={() => handlePersonClick(profile.id)} // 카드 클릭 시 프로필 페이지로 이동
            >
              <h2>{profile.name}</h2>
              <p>{profile.description}</p>
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

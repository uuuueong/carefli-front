import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 샘플 인물 데이터 (PersonEnroll.js에서 받아오는 실제 데이터를 사용하도록 수정 필요)
const initialProfiles = [
  { id: 1, name: '손윤지', description: '인물에대한간략정보1' },
  { id: 2, name: '정이진', description: '인물에대한간략정보2' },
  { id: 3, name: '정지은', description: '인물에대한간략정보3' },
  { id: 4, name: '김이화', description: '인물에대한간략정보4' },
];

function Main() {
  const [profiles, setProfiles] = useState(initialProfiles); // 인물 프로필 목록 관리
  const navigate = useNavigate();

  // 인물 등록 페이지로 이동
  const handleEnrollClick = () => {
    navigate('/person-enroll'); // '/person-enroll' 경로는 PersonEnroll.js에 맞게 설정
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>인맥 모음.zip</h1>
        <button style={styles.enrollButton} onClick={handleEnrollClick}>
          인맥 등록하기
        </button>
      </header>
      
      <section style={styles.profileList}>
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div key={profile.id} style={styles.profileCard}>
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

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  enrollButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
  profileList: {
    display: 'flex',
    flexWrap: 'wrap', // Flexbox로 감싸서 여러 열로 보여줌
    gap: '10px', // 카드 사이의 간격 설정
  },
  profileCard: {
    flex: '1 1 calc(50% - 10px)', // 2열로 나눠지게 설정, 카드 간격 고려
    boxSizing: 'border-box',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default Main;

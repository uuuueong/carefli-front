import React from 'react';
import { useParams } from 'react-router-dom';

function PersonProfile() {
  const { id } = useParams(); // URL의 파라미터에서 id를 가져옴

  // localStorage에서 'people' 항목을 불러와서 JSON으로 파싱
  const people = JSON.parse(localStorage.getItem('people')) || [];

  // id에 맞는 프로필 찾기 (URL에서 받은 id에 해당하는 프로필)
  const profile = people.find((p, index) => index + 1 === parseInt(id));

  if (!profile) {
    return <h2>해당 인물을 찾을 수 없습니다.</h2>; // id에 맞는 프로필이 없을 때
  }

  return (
    <div style={styles.container}>
      <h1>{profile.name}의 프로필</h1>
      {/* base64로 저장된 이미지를 img 태그로 출력 */}
      {profile.profileImage && <img src={profile.profileImage} alt={`${profile.name}'s profile`} style={styles.image} />}
      <p>관계: {profile.relationship}</p>
      <p>생일: {profile.birthday}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column', // 수직 정렬
    alignItems: 'center', // 수평 중앙 정렬
    height: '100vh',
    backgroundColor: '#f9f9f9',
    textAlign: 'center', // 텍스트도 중앙 정렬
    padding: '20px', // 콘텐츠 여백
  },

  image: {
    display: 'block',
    width: '150px',
    height: '150px',
    borderRadius: '50%', // 원형 이미지
    objectFit: 'cover',  // 이미지가 원형으로 잘리더라도 비율 유지
    marginBottom: '20px', // 이미지랑 텍스트 사이의 간격
  },
};

export default PersonProfile;

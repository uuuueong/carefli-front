import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PersonProfile() {
  const { connectionId } = useParams(); // URL의 파라미터에서 id를 가져옴
  const [profile, setProfile] = useState(null); // 프로필 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  
  useEffect(() => {
    // 서버에서 프로필 데이터를 가져오는 함수
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        console.log("Access Token:", accessToken);
        console.log("Connection ID:", connectionId);

        const response = await axios.get(`https://api.carefli.p-e.kr/connections/${connectionId}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`, 
          },
        });


        setProfile(response.data); // 서버에서 받은 데이터를 상태로 저장
        setLoading(false); // 로딩 완료
      } catch (err) {
        console.error('프로필 데이터를 가져오는 데 실패했습니다.', err);
        setError(err);
        setLoading(false); // 로딩 완료
      }
    };

    fetchProfile(); // 컴포넌트가 렌더링될 때 서버에서 프로필 데이터 가져옴
  }, [connectionId]);

  // 로딩 상태 처리
  if (loading) {
    return <h2>프로필 데이터를 불러오는 중입니다...</h2>;
  }

  // 오류 상태 처리
  if (error) {
    return <h2>프로필 데이터를 가져오는 중 오류가 발생했습니다.</h2>;
  }

  // 프로필이 없을 때 처리
  if (!profile) {
    return <h2>해당 인물을 찾을 수 없습니다.</h2>;
  }

  return (
    <div style={styles.container}>
      <h1>{profile.connectionName}의 프로필</h1>
      {/* 이미지가 있을 경우 표시 */}
      {profile.profileImage && <img src={profile.profileImage} alt={`${profile.name}'s profile`} style={styles.image} />}
      <p>관계: {profile.relationship}</p>
      <p>생일: {profile.birthday}</p>
      <p>MBTI: {profile.mbti}</p>
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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';

const API_BASE_URL = 'https://api.carefli.p-e.kr';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        alert('사용자 정보를 불러오는 데 실패했습니다.');
        navigate('/signup'); // 인증 실패 시 로그인 페이지로 이동
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditClick = () => {
    navigate('/edit-myinfo');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mypage-container">
      <header className="mypage-header">
        <h1>내 이야기</h1>
        <button onClick={handleEditClick} className="mypage-edit-button">
          수정하기
        </button>
      </header>

      <div className="mypage-profile-card">
        <div className="mypage-name-section">
          <p>나의 이름은 <strong>{userData.nickname}</strong></p>
          <p>인물 등록 날짜 <strong>{new Date(userData.createdAt).toLocaleDateString()}</strong></p>
        </div>
        <div className="mypage-avatar">
          <img
            src={userData.userImageUrl || 'https://via.placeholder.com/80'}
            alt="프로필 이미지"
            className="mypage-avatar-image"
          />
        </div>
      </div>

      <br></br>

      <section>
        <h2>{userData.nickname} 님은 어떤 분인가요?</h2>
        <p>MBTI: <strong>{userData.mbti || '미등록'}</strong></p>
        <p>생일: <strong>{userData.birthday || '미등록'}</strong></p>
      </section>

      <br></br>

      <section>
        <h2>{userData.nickname} 님의 관심사는?</h2>
        <div className="mypage-interests">
          {userData.interestTag ? (
            <div>
              {userData.interestTag.split(",").map((tag, index) => (
                <span key={index} className="mypage-interest">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          ) : (
            <span className="mypage-interest">등록된 관심사가 없습니다</span>
          )}
        </div>
      </section>

      <br></br>

      <footer className="mypage-footer">
        <button className="mypage-footer-button" onClick={() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/signup');
        }}>
          로그아웃
        </button>
        <button className="mypage-footer-button">탈퇴하기</button>
      </footer>
    </div>
  );
};

export default MyPage;

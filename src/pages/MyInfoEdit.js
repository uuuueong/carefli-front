import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MyInfoEdit.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api.carefli.p-e.kr';

const MyInfoEdit = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    birthday: '',
    mbti: '',
    interestTag: [], 
  });

  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const interestsList = [
    '뷰티', '주류', '커피/음료', '디저트',
    '의류', '악세사리', '잡화', '반려동물', '유아동', '리빙', '건강', '식품', '디지털/가전', '도서/음반/티켓'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const userData = response.data;
        setFormData({
          nickname: userData.nickname || '',
          email: userData.email || '',
          birthday: userData.birthday || '',
          mbti: userData.mbti || '',
          interestTag: userData.interestTag ? userData.interestTag.split(',') : [], // 배열로 처리
        });

        if (userData.userImageUrl) {
          setUserImage(userData.userImageUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        alert('사용자 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setUserImage(e.target.files[0]);
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleInterestClick = (interest) => {
    setFormData((prev) => {
      const { interestTag } = prev;

      if (interestTag.includes(interest)) {
        // 이미 선택된 경우 제거
        return {
          ...prev,
          interestTag: interestTag.filter((tag) => tag !== interest),
        };
      } else if (interestTag.length < 3) {
        // 선택되지 않은 경우 추가 (최대 3개 제한)
        return {
          ...prev,
          interestTag: [...interestTag, interest],
        };
      } else {
        alert('최대 3개까지만 선택 가능합니다.');
        return prev;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const filteredFormData = {};
      for (const key in formData) {
        if (formData[key]) {
          filteredFormData[key] = key === 'interestTag' ? formData[key].join(',') : formData[key]; // 배열을 문자열로 변환
        }
      }

      const data = new FormData();
      data.append(
        'userUpdateRequestDto',
        new Blob([JSON.stringify(filteredFormData)], { type: 'application/json' })
      );

      if (userImage && typeof userImage !== 'string') {
        data.append('userImage', userImage);
      }

      await axios.patch(`${API_BASE_URL}/users`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('프로필이 성공적으로 업데이트되었습니다.');
      navigate('/mypage');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        window.location.href = '/mypage';
      } else {
        console.error('Failed to update profile:', error);
        alert('프로필 업데이트에 실패했습니다.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="my-info-edit-form">
      <div className="my-info-profile-picture" onClick={handleProfileClick}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        {userImage ? (
          typeof userImage === 'string' ? (
            <img src={userImage} alt="프로필 사진" />
          ) : (
            <img src={URL.createObjectURL(userImage)} alt="프로필 사진" />
          )
        ) : (
          <div className="my-info-placeholder">프로필 사진</div>
        )}
      </div>
      <label className="my-info-label">
        닉네임:
        <input className="my-info-input" type="text" name="nickname" value={formData.nickname} onChange={handleInputChange} />
      </label>
      <label className="my-info-label">
        이메일:
        <input className="my-info-input" type="email" name="email" value={formData.email} onChange={handleInputChange} />
      </label>
      <label className="my-info-label">
        생일:
        <input className="my-info-input" type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} />
      </label>
      <label className="my-info-label">
        MBTI:
        <input className="my-info-input" type="text" name="mbti" value={formData.mbti} onChange={handleInputChange} />
      </label>
      <div className="my-info-interests-section">
        <h3>관심사 및 취향</h3>
        <div className="my-info-interests">
          {interestsList.map((interest) => (
            <button
              type="button"
              key={interest}
              className={`my-info-interest-button ${formData.interestTag.includes(interest) ? 'selected' : ''}`}
              onClick={() => handleInterestClick(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="my-info-save-button">저장하기</button>
    </form>
  );
};

export default MyInfoEdit;

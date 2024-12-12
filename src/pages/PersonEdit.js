import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PersonEdit.css';
import { useNavigate, useParams } from 'react-router-dom';

const PersonEdit = () => {
  const { connectionId } = useParams(); // URL 파라미터로 connectionId 가져오기

  const [formData, setFormData] = useState({
    connectionName: '',
    birthday: '',
    interestTag: [],
    mbti: '',
    relationship: '',
  });

  const [connectionImage, setConnectionImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const interestsList = [
    '뷰티', '주류', '커피/음료', '디저트',
    '의류', '악세사리', '잡화', '반려동물', '유아동', '리빙', '건강', '식품', '디지털/가전', '도서/음반/티켓',
  ];

  useEffect(() => {
    const fetchConnectionData = async () => {
      try {
        const response = await axios.get(`https://api.carefli.p-e.kr/connections/${connectionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const connectionData = response.data;
        setFormData({
          connectionName: connectionData.connectionName || '',
          birthday: connectionData.birthday || '',
          interestTag: connectionData.interestTag ? connectionData.interestTag.split('-') : [],
          mbti: connectionData.mbti || '',
          relationship: connectionData.relationship || '',
        });

        if (connectionData.connectionImageUrl) {
          setConnectionImage(connectionData.connectionImageUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch connection data:', error);
        alert('인물 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchConnectionData();
  }, [connectionId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setConnectionImage(e.target.files[0]);
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
          filteredFormData[key] = key === 'interestTag' ? formData[key].join('-') : formData[key]; // 배열을 문자열로 변환
        }
      }

      filteredFormData.connectionId = connectionId;

      const data = new FormData();
      data.append(
        'connectionUpdateRequestDto',
        new Blob([JSON.stringify(filteredFormData)], { type: 'application/json' })
      );

      if (connectionImage && typeof connectionImage !== 'string') {
        data.append('connectionImage', connectionImage);
      }

      await axios.patch(`https://api.carefli.p-e.kr/connections/${connectionId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('인물 정보가 성공적으로 업데이트되었습니다.');
      navigate('/main');
    } catch (error) {
      console.error('Failed to update connection data:', error);
      alert('인물 정보 업데이트에 실패했습니다.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="person-edit-form">
      <div className="person-profile-picture" onClick={handleProfileClick}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        {connectionImage ? (
          typeof connectionImage === 'string' ? (
            <img src={connectionImage} alt="프로필 사진" />
          ) : (
            <img src={URL.createObjectURL(connectionImage)} alt="프로필 사진" />
          )
        ) : (
          <div className="person-placeholder">프로필 사진</div>
        )}
      </div>
      <label className="person-label">
        이름:
        <input className="person-input" type="text" name="connectionName" value={formData.connectionName} onChange={handleInputChange} />
      </label>
      <label className="person-label">
        생일:
        <input className="person-input" type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} />
      </label>
      <label className="person-label">
        MBTI:
        <input className="person-input" type="text" name="mbti" value={formData.mbti} onChange={handleInputChange} />
      </label>
      <label className="person-label">
        관계:
        <input className="person-input" type="text" name="relationship" value={formData.relationship} onChange={handleInputChange} />
      </label>
      <div className="person-interests-section">
        <h3>관심사</h3>
        <div className="person-interests">
          {interestsList.map((interest) => (
            <button
                type="button"
                key={interest}
                className={`person-interest-button ${
                    formData.interestTag.includes(interest) ? 'selected' : ''
                }`}
                onClick={() => handleInterestClick(interest)}
            >
                {interest}
            </button>
        ))}
    </div>
      </div>
      <button type="submit" className="person-save-button">저장하기</button>
    </form>
  );
};

export default PersonEdit;
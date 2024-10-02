import React, { useState } from 'react';
import './Present.css'; // 스타일을 가져옴

const profiles = [
  { id: 1, name: '손윤지', description: '인물에 대한 간략 정보 1' },
  { id: 2, name: '정이진', description: '인물에 대한 간략 정보 2' },
  { id: 3, name: '정지은', description: '인물에 대한 간략 정보 3' },
  { id: 4, name: '김이화', description: '인물에 대한 간략 정보 4' },
];

function Present() {
  const [selectedProfile, setSelectedProfile] = useState('');

  const handleSelectChange = (event) => {
    setSelectedProfile(event.target.value);
  };

  return (
    <div className="container">
      <div>
        <h1 className="text">인물 선택</h1>
        <select value={selectedProfile} onChange={handleSelectChange}>
          <option value="">인물을 선택하세요</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.name}>
              {profile.name}
            </option>
          ))}
        </select>

        {selectedProfile && (
          <div style={{ marginTop: '20px' }}>
            <h2 className="text">선택된 인물: {selectedProfile}</h2>
            <p>
              {profiles.find((profile) => profile.name === selectedProfile)?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Present;

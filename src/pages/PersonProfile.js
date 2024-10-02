import React from 'react';
import { useParams } from 'react-router-dom';

// 샘플 데이터 (실제로는 백엔드에서 받아오기)
const profiles = [
  { id: 1, name: '손윤지', description: '인물에 대한 간략 정보 1' },
  { id: 2, name: '정이진', description: '인물에 대한 간략 정보 2' },
  { id: 3, name: '정지은', description: '인물에 대한 간략 정보 3' },
  { id: 4, name: '김이화', description: '인물에 대한 간략 정보 4' },
];

function PersonProfile() {
  const { id } = useParams(); // URL의 파라미터에서 id를 가져옴
  const profile = profiles.find((p) => p.id === parseInt(id)); // id에 맞는 프로필 찾기

  if (!profile) {
    return <h2>해당 인물을 찾을 수 없습니다.</h2>; // id에 맞는 프로필이 없을 때
  }

  return (
    <div>
      <h1>{profile.name}의 프로필</h1>
      <p>{profile.description}</p>
    </div>
  );
}

export default PersonProfile;

import React, { useState } from 'react';
import axios from 'axios';

function PersonEnroll() {
  // 입력한 데이터 상태 관리
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [birthday, setBirthday] = useState('');

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체를 사용하여 파일과 데이터를 함께 전송
    const formData = new FormData();
    formData.append('profileImage', profileImage);
    formData.append('name', name);
    formData.append('relationship', relationship);
    formData.append('birthday', birthday);

    try {
      // 서버에 데이터 전송
      const response = await axios.post('/api/person', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('인물 등록이 완료되었습니다.');
        // 폼 리셋
        setProfileImage(null);
        setName('');
        setRelationship('');
        setBirthday('');
      }
    } catch (error) {
      console.error('인물 등록 중 오류가 발생했습니다.', error);
      alert('인물 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>인물 등록하기</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          프로필 사진:
          <input type="file" accept=".jpg" onChange={handleImageChange} style={styles.input} />
        </label>
        <label style={styles.label}>
          이름:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>
          관계:
          <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>
          생일:
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} style={styles.input} required />
        </label>
        <button type="submit" style={styles.submitButton}>등록하기</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  submitButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default PersonEnroll;

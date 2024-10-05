import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileDefault from "../image/profileDefault.png";
import GenerateMBTI from "../llm/GenerateMBTI";

function PersonEnroll() {
  // 입력한 데이터 상태 관리
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mbti, setMBTI] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("mbti:", mbti);
  }, [mbti]);

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 이미지 파일과 입력 데이터 저장
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPerson = {
        profileImage: reader.result, // 이미지 파일을 base64로 저장
        name: name,
        relationship: relationship,
        birthday: birthday,
        mbti: mbti,
      };

      // 기존 데이터 불러오기
      const people = JSON.parse(localStorage.getItem("people")) || [];

      // 새로운 인물 정보 추가
      people.push(newPerson);

      // 로컬 스토리지에 저장
      localStorage.setItem("people", JSON.stringify(people));

      alert("인물 등록이 완료되었습니다.");

      // 폼 리셋
      setProfileImage(null);
      setName("");
      setRelationship("");
      setBirthday("");
      setMBTI("");

      navigate("/main");
    };

    if (profileImage) {
      reader.readAsDataURL(profileImage);
    } else {
      // 이미지가 없으면 기본 이미지로 설정
      const newPerson = {
        profileImage: profileDefault,
        name: name,
        relationship: relationship,
        birthday: birthday,
        mbti: mbti,
      };

      const people = JSON.parse(localStorage.getItem("people")) || [];
      people.push(newPerson);
      localStorage.setItem("people", JSON.stringify(people));

      alert("인물 등록이 완료되었습니다.");

      // 폼 리셋
      setProfileImage(null);
      setName("");
      setRelationship("");
      setBirthday("");
      setMBTI("");

      // Main.js로 리디렉션
      navigate("/main");
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
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          생일:
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          MBTI:
          <input type="text" value={mbti} onChange={(e) => setMBTI(e.target.value)} style={styles.input} required />
        </label>
        <GenerateMBTI name={name} relationship={relationship} birthday={birthday} setMBTI={setMBTI} />
        <button type="submit" style={styles.submitButton}>
          등록하기
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },

  mbtiButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#5469c1",
    color: "white",
    cursor: "pointer",
    width: "20%",
    marginLeft: "auto",
    display: "block",
    marginBottom: "20px",
  },

  submitButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#5469c1",
    color: "#fff",
    cursor: "pointer",
  },
};

export default PersonEnroll;

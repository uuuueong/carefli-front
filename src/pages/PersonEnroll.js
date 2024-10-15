import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileDefault from "../image/profileDefault.png";
import GenerateMBTI from "../llm/GenerateMBTI";
import axios from "axios";
import "./PersonEnroll.css"; // CSS 파일 불러오기

function PersonEnroll() {
  // 입력한 데이터 상태 관리
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mbti, setMBTI] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    console.log("mbti:", mbti);
  }, [mbti]);

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // JSON으로 보낼 데이터 객체 생성
    const requestData = {
      connectionName: name,
      relationship: relationship,
      birthday: birthday,
      mbti: mbti,
      profileImage: profileImage ? profileImage : profileDefault,
    };

    const accessToken = localStorage.getItem("accessToken");
    console.log("Access Token:", accessToken);

    axios
      .post("https://api.carefli.p-e.kr/connections", JSON.stringify(requestData), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // JSON 형식으로 보냄
        },
      })
      .then((response) => {
        console.log("Response:", response);
        alert("인물 등록이 완료되었습니다.");

        // 폼 리셋
        setProfileImage(null);
        setName("");
        setRelationship("");
        setBirthday("");
        setMBTI("");

        axios
          .get(`https://api.carefli.p-e.kr/connections`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            localStorage.setItem("profiles", JSON.stringify(response.data));
            // 메인 페이지로 이동
            navigate("/main");
          })
          .catch((err) => {
            console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
          });
      })
      .catch((error) => {
        console.error("인물 등록 실패:", error);
        alert("인물 등록에 실패했습니다.");
      });
  };

  return (
    <div className="container">
      <h1>인물 등록하기</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="label">
          프로필 사진:
          <input type="file" accept=".jpg" onChange={handleImageChange} className="input" />
        </label>
        <label className="label">
          이름:
          <input type="text" value={name} placeholder="ex) 김이화" onChange={(e) => setName(e.target.value)} className="input" required />
        </label>
        <label className="label">
          관계:
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="input"
            placeholder="ex) 친구, 선생님, 동기"
            required
          />
        </label>
        <label className="label">
          생일:
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="input"
            required
          />
        </label>
        <label className="label">
          MBTI:
          <input 
          type="text" 
          value={mbti} 
          placeholder={mbti ? "" : "ex) ESTP"}
          onChange={(e) => setMBTI(e.target.value)} 
          className="input" 
          required />
        </label>
        <GenerateMBTI 
        name={name} 
        relationship={relationship} 
        birthday={birthday} 
        setMBTI={setMBTI} />
        <button type="submit" className="submitButton">
          등록하기
        </button>
      </form>
    </div>
  );
}

export default PersonEnroll;

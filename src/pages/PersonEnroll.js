import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileDefault from "../image/profileDefault.png";
import GenerateMBTI from "../llm/GenerateMBTI";
import GenerateCategories from "../llm/GenerateCategories";
import axios from "axios";
import "./PersonEnroll.css"; // CSS 파일 불러오기
import DynamicButtonsCategory from "../components/DynamicButtonsCategory";
import AlertModal from "../components/AlertModal";

function PersonEnroll() {
  // 입력한 데이터 상태 관리
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mbti, setMBTI] = useState("");
  const [categories, setCategories] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  // 선물 주는 기념일
  const eventsData = [
    { text: "뷰티", value: "뷰티" },
    { text: "주류", value: "주류" },
    { text: "커피/음료", value: "커피/음료" },
    { text: "디저트", value: "차량용품" },
    { text: "의류", value: "의류" },
    { text: "악세사리", value: "악세사리" },
    { text: "잡화", value: "잡화" },
    { text: "반려동물", value: "반려동물" },
    { text: "유아동", value: "유아동" },
    { text: "리빙", value: "리빙" },
    { text: "건강", value: "건강" },
    { text: "식품", value: "식품" },
    { text: "디지털/가전", value: "디지털/가전" },
    { text: "도서/음반/티켓", value: "도서/음반/티켓" },
  ];

  useEffect(() => {
    console.log("mbti:", mbti);
  }, [mbti]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // 버튼 클릭 시 MBTI의 특정 위치 업데이트
  const handleMBTISelection = (index, value) => {
    const updatedMBTI = mbti.split(""); // 문자열을 배열로 변환
    updatedMBTI[index] = value; // 선택된 값을 해당 인덱스에 반영
    setMBTI(updatedMBTI.join("")); // 배열을 다시 문자열로 변환
  };

  const handleCategorySelect = (catText) => {
    setCategories((prevCats) => (prevCats.includes(catText) ? prevCats : [...prevCats, catText]));
  };

  const handleCategoryDeSelect = (catText) => {
    setCategories((prevCats) => prevCats.filter((cat) => cat !== catText));
  };
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    // MBTI 필수 선택 확인
    if (!mbti) {
      alert("MBTI를 선택해 주세요.");
      return;
    }
    // 카테고리 최소 3개 선택 확인
    if (categories.length < 3) {
      alert("카테고리를 최소 3개 선택해 주세요.");
      return;
    }

    try {
      const cat_results = categories.join("-");

      const requestData = {
        connectionName: name,
        birthday: birthday,
        interestTag: cat_results,
        mbti: mbti,
        relationship: relationship,
      };

      const data = new FormData();

      // JSON 데이터 추가, Key: connectionCreateRequestDto
      data.append("connectionCreateRequestDto", new Blob([JSON.stringify(requestData)], { type: "application/json" }));

      // 이미지를 업로드한 경우 connectionImage 추가
      if (profileImage) {
        data.append("connectionImage", profileImage);
      }

      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post("https://api.carefli.p-e.kr/connections", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type은 FormData 사용 시 자동 설정되게
        },
      });

      if (response.status === 200 || response.status === 201) {
        setShowAlert(true); // 모달 표시
        // alert("인물 등록이 완료되었습니다.");
        // navigate("/main");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("인물 등록 실패:", error.response || error);
      alert("인물 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="container">
      <h1>인물 등록하기</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="label">
          프로필 사진:
          <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
        </label>
        <label className="label">
          이름:
          <input
            type="text"
            value={name}
            placeholder="ex) 김이화"
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
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
          <div className="mbti-buttons">
            <div className="mbti-row">
              <p>외향 E / 내향 I :</p>
              <button
                type="button"
                onClick={() => handleMBTISelection(0, "E")}
                className={`mbti-button ${mbti[0] === "E" ? "active1" : ""}`}
              >
                E
              </button>
              <button
                type="button"
                onClick={() => handleMBTISelection(0, "I")}
                className={`mbti-button ${mbti[0] === "I" ? "active1" : ""}`}
              >
                I
              </button>
            </div>
            <div className="mbti-row">
              <p>감각 S / 직관 N :</p>
              <button
                type="button"
                onClick={() => handleMBTISelection(1, "S")}
                className={`mbti-button ${mbti[1] === "S" ? "active2" : ""}`}
              >
                S
              </button>
              <button
                type="button"
                onClick={() => handleMBTISelection(1, "N")}
                className={`mbti-button ${mbti[1] === "N" ? "active2" : ""}`}
              >
                N
              </button>
            </div>
            <div className="mbti-row">
              <p>사고 T / 감정 F :</p>
              <button
                type="button"
                onClick={() => handleMBTISelection(2, "T")}
                className={`mbti-button ${mbti[2] === "T" ? "active3" : ""}`}
              >
                T
              </button>
              <button
                type="button"
                onClick={() => handleMBTISelection(2, "F")}
                className={`mbti-button ${mbti[2] === "F" ? "active3" : ""}`}
              >
                F
              </button>
            </div>
            <div className="mbti-row">
              <p>인식 P / 판단 J :</p>
              <button
                type="button"
                onClick={() => handleMBTISelection(3, "P")}
                className={`mbti-button ${mbti[3] === "P" ? "active4" : ""}`}
              >
                P
              </button>
              <button
                type="button"
                onClick={() => handleMBTISelection(3, "J")}
                className={`mbti-button ${mbti[3] === "J" ? "active4" : ""}`}
              >
                J
              </button>
            </div>
            <div className="mbti-row">{mbti && <p className="mbti">MBTI : {mbti}</p>}</div>
            <div className="generate-mbti">
              <GenerateMBTI name={name} relationship={relationship} birthday={birthday} setMBTI={setMBTI} />
            </div>
          </div>
        </label>
        {mbti && (
          <DynamicButtonsCategory
            buttonsData={eventsData}
            onButtonClick={handleCategorySelect}
            onButtonDeselect={handleCategoryDeSelect}
            multipleSelect="multiple"
            selectedCategories={categories}
          />
        )}
        {mbti && (
          <div className="button-group" style={{ marginTop: "-12px" }}>
            <GenerateCategories mbti={mbti} setCategories={setCategories} />
            <button type="submit" className="submitButton">
              등록하기
            </button>
            {showAlert && (
              <AlertModal
                message="인물 등록 완료!"
                onClose={() => {
                  setShowAlert(false);
                  navigate("/main");
                }} // 모달 닫기
              />
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default PersonEnroll;

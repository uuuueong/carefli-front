import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileDefault from "../image/profileDefault.png";
import GenerateMBTI from "../llm/GenerateMBTI";
import GenerateCategories from "../llm/GenerateCategories";
import axios from "axios";
import "./PersonEnroll.css"; // CSS 파일 불러오기
import DynamicButtonsCategory from "../components/DynamicButtonsCategory";

function PersonEnroll() {
  // 입력한 데이터 상태 관리
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [birthday, setBirthday] = useState("");
  const [mbti, setMBTI] = useState("");
  const [categories, setCategories] = useState([]);
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
  useEffect(() => {}, [categories]);

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
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

    const cat_results = categories.join("-");
    // JSON으로 보낼 데이터 객체 생성
    const requestData = {
      connectionName: name,
      relationship: relationship,
      birthday: birthday,
      mbti: mbti,
      interestTag: cat_results,
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
        setCategories([]);

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
          <input
            type="text"
            value={mbti}
            placeholder={mbti ? "" : "ex) ESTP"}
            onChange={(e) => setMBTI(e.target.value)}
            className="input"
            required
          />
        </label>
        <GenerateMBTI name={name} relationship={relationship} birthday={birthday} setMBTI={setMBTI} />
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
          </div>
        )}
      </form>
    </div>
  );
}

export default PersonEnroll;

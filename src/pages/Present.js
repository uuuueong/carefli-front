import React, { useEffect, useState } from "react";
import "./Present.css"; // 스타일을 가져옴
import DynamicButtons from "../components/DynamicButtons";
import presentEventImg from "../image/presentEvent.png";
import presentWho from "../image/presentWho.gif";
import presentMoney from "../image/presentMoney.png";
import GiftRecommendation from "../llm/GiftReccomendation";
import axios from "axios";

// 선물 주는 대상 선택
const profiles = [
  {
    userId: 1,
    connectionId: 1,
    connectionName: "손윤지",
    birthday: "2000-08-06",
    interestTag: "TRAVEL",
    mbti: "ISTJ",
    relationship: "친구",
  },
  {
    userId: 1,
    connectionId: 2,
    connectionName: "정이진",
    birthday: "2000-08-06",
    interestTag: "TRAVEL",
    mbti: "ESTP",
    relationship: "친구",
  },
  {
    userId: 1,
    connectionId: 3,
    connectionName: "정지은",
    birthday: "2000-08-06",
    interestTag: "TRAVEL",
    mbti: "ESFP",
    relationship: "친구",
  },
  {
    userId: 1,
    connectionId: 4,
    connectionName: "김이화",
    birthday: "2000-08-06",
    interestTag: "TRAVEL",
    mbti: "ENTP",
    relationship: "친구",
  },
];

// 선물 주는 기념일
const eventsData = [
  { text: "생일", value: "생일" },
  { text: "결혼", value: "결혼" },
  { text: "입사", value: "입사" },
  { text: "합격", value: "합격" },
  { text: "졸업", value: "졸업" },
];

// 선물 가격 범위 선택
const priceData = [
  { text: "~ 1만원", minPrice: 0, maxPrice: 9999 },
  { text: "1만원대", minPrice: 10000, maxPrice: 19999 },
  { text: "2만원대", minPrice: 20000, maxPrice: 29999 },
  { text: "3만원대", minPrice: 30000, maxPrice: 39999 },
  { text: "4만원대", minPrice: 40000, maxPrice: 49999 },
  { text: "5만원대", minPrice: 50000, maxPrice: 59999 },
  { text: "10만원~", minPrice: 100000, maxPrice: 999999 },
];

const subCatData = [
  { text: "스킨케어", value: "스킨케어" },
  { text: "향기", value: "향기" },
  { text: "화장품", value: "화장품" },
  { text: "식기", value: "식기" },
  { text: "상품권", value: "상품권" },
  { text: "금액권", value: "금액권" },
  { text: "디저트", value: "디저트" },
  { text: "차량용품", value: "차량용품" },
  { text: "의류", value: "의류" },
  { text: "악세사리", value: "악세사리" },
  { text: "잡화", value: "잡화" },
  { text: "반려동물", value: "반려동물" },
  { text: "유아동", value: "유아동" },
  { text: "건강", value: "건강" },
  { text: "과일", value: "향기" },
  { text: "식품", value: "식품" },
  { text: "가전", value: "가전" },
];

const giftItems = [
  {
    id: 1,
    name: "달바 '비건' 오리지널 미스트 세럼 선물 세트 (100ml+50ml)",
    price: 31900,
    url: "https://gift.kakao.com/product/5392498?tab=review&sortProperty=SCORE",
    img: presentMoney,
  },
  {
    id: 2,
    name: "나만의 비어캔 맥주잔 특별한 각인 술잔 남자 여자 친구 생일 자취 직장인 이사 신혼부부 선물 커플 하이볼잔 남친",
    price: 23900,
    url: "https://gift.kakao.com/product/10028370",
    img: presentEventImg,
  },
  {
    id: 3,
    name: "아이스 카페 아메리카노 T 2잔 + 부드러운 생크림 카스텔라",
    price: 13500,
    url: "https://gift.kakao.com/product/7892633",
    img: "업로드한이미지주소",
  },
];

function Present() {
  const [currentPage, setCurrentPage] = useState("Profile");
  const [selectedProfile, setSelectedProfile] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [selectedSubCat, setSelectedSubCat] = useState([]);
  const [finalRecommendations, setFinalRecommendations] = useState([]);
  const [presentList, setPresentList] = useState([]);
  const [finalMessage, setFinalMessage] = useState(""); // 최종 메시지 상태

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedProfile = profiles.find((profile) => profile.connectionName === selectedName);
    setSelectedProfile(selectedProfile);
  };

  const handleEventSelect = (eventText) => {
    setSelectedEvent(eventsData.find((event) => event.text === eventText));
  };

  const handleEventDeSelect = (eventText) => {
    setSelectedEvent({});
  };

  const handlePriceSelect = (priceText) => {
    setSelectedPrice(priceData.find((price) => price.text === priceText));
  };

  const handlePriceDeSelect = () => {
    setSelectedPrice({});
  };

  const handleSubCatSelect = (subCatText) => {
    setSelectedSubCat((prevSubCats) => {
      if (prevSubCats.includes(subCatText)) {
        return prevSubCats.filter((cat) => cat !== subCatText);
      } else {
        return [...prevSubCats, subCatText];
      }
    });
  };

  const handleSubCatDeSelect = (subCatText) => {
    setSelectedSubCat((prevSubCats) => prevSubCats.filter((cat) => cat !== subCatText));
  };

  const stateSetters = {
    Profile: setSelectedProfile,
    Event: setSelectedEvent,
    Price: setSelectedPrice,
    SubCat: setSelectedSubCat,
  };

  const handleButtonClick = (page) => {
    setCurrentPage(page);
    const setFunction = stateSetters[page];
    if (setFunction) {
      if (page !== "SubCat") setFunction({});
      else setFunction([]);
    }
    if (page === "Event") handlePriceDeSelect();
    else if (page === "Price") setSelectedSubCat([]);
  };

  useEffect(() => {
    if (selectedPrice?.minPrice && selectedPrice?.maxPrice) {
      axios
        .get(
          `https://api.carefli.p-e.kr/gifts/list?minPrice=${selectedPrice?.minPrice}&maxPrice=${selectedPrice?.maxPrice}`
        )
        .then((response) => {
          setPresentList(response.data); // Assuming the response data is the array of gifts
        })
        .catch((error) => {
          console.error("Failed to fetch presents:", error);
        });
    }
  }, [selectedPrice]);

  useEffect(() => {
    if (finalRecommendations.length > 0) {
      setCurrentPage("Gifts");
      setFinalMessage(`Recommended Gifts: ${JSON.stringify(finalRecommendations)}`); // 콘솔 결과 화면에 표시
    }
  }, [finalRecommendations]);

  useEffect(() => {
    console.log(
      "profile:",
      selectedProfile,
      "event:",
      selectedEvent,
      "price:",
      selectedPrice,
      "subcat:",
      selectedSubCat
    );
  }, [selectedProfile, selectedEvent, selectedPrice, selectedSubCat]);

  return (
    <div className="writing div-container">
      {currentPage === "Profile" && (
        <>
          <h1 className="text">
            누구를 위한
            <br /> 선물을 찾아볼까?
          </h1>
          <img src={presentWho} alt="presentWho" className="present-image" />

          <select className="select" value={selectedProfile?.connectionName || ""} onChange={handleSelectChange}>
            <option value="">인물을 선택하세요</option>
            {profiles.map((profile) => (
              <option key={profile.connectionId} value={profile.connectionName}>
                {profile.connectionName}
              </option>
            ))}
          </select>
          <div className="button-group">
            <button className="button" onClick={() => handleButtonClick("Event")}>
              다음
            </button>
          </div>
        </>
      )}
      {currentPage === "Event" && (
        <>
          <h1 className="text">
            무슨 날이야?
            <br />
            이벤트를 선택해줘
          </h1>
          <img src={presentEventImg} alt="presentEventImg" className="present-image" />

          <DynamicButtons
            buttonsData={eventsData}
            onButtonClick={handleEventSelect}
            onButtonDeselect={handleEventDeSelect}
          />

          <div className="button-group">
            <button className="button" onClick={() => handleButtonClick("Profile")}>
              뒤로: 인물 다시 선택하기
            </button>
            <button className="button" onClick={() => handleButtonClick("Price")}>
              다음
            </button>
          </div>
        </>
      )}
      {currentPage === "Price" && (
        <>
          <h1 className="text">
            N원대의 <br /> 가격대가 좋을 것 같아 !
          </h1>
          <img src={presentMoney} alt="presentMoney" className="present-image" />

          <DynamicButtons
            buttonsData={priceData}
            onButtonClick={handlePriceSelect}
            onButtonDeselect={handlePriceDeSelect}
          />
          <div className="button-group">
            <button className="button" onClick={() => handleButtonClick("Event")}>
              뒤로: 이벤트 다시 선택하기
            </button>
            <button className="button" onClick={() => handleButtonClick("SubCat")}>
              다음
            </button>
          </div>
        </>
      )}
      {currentPage === "SubCat" && (
        <>
          <h1 className="text">더 추가할 내용 있어?</h1>
          <DynamicButtons
            buttonsData={subCatData}
            onButtonClick={handleSubCatSelect}
            onButtonDeselect={handleSubCatDeSelect}
            multipleSelect="multiple"
          />
          <div className="button-group">
            <button className="button" onClick={() => handleButtonClick("Price")}>
              뒤로: 가격대 다시 선택하기
            </button>
            <GiftRecommendation
              presentList={presentList}
              selectedProfile={selectedProfile}
              selectedEvent={selectedEvent}
              selectedPrice={selectedPrice}
              selectedSubCat={selectedSubCat}
              setFinalRecommendations={setFinalRecommendations}
            />
          </div>
        </>
      )}
      {currentPage === "Gifts" && (
        <div style={{ overflowY: "auto", maxHeight: "80vh", paddingRight: "15px" }}>
          <h1 className="text">찾은 선물 리스트야!</h1>
          <p>{finalMessage}</p>
          {giftItems.map((gift) => (
            <div key={gift.id} className="gift-container">
              <div style={{ flex: 1 }}>
                <h2 className="gift-title">{gift.name}</h2>
                <p className="gift-price">가격: {gift.price.toLocaleString()}원</p>
                <a href={gift.url} target="_blank" rel="noopener noreferrer">
                  <button className="gift-link">URL 바로가기</button>
                </a>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <img
                  src={gift.img}
                  alt="제품 이미지"
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Present;

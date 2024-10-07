import React, { useEffect, useState } from "react";
import "./Present.css"; // 스타일을 가져옴
import DynamicButtons from "../components/DynamicButtons";
import presentEventImg from "../image/presentEvent.png";
import presentWho from "../image/presentWho.gif";
import presentMoney from "../image/presentMoney.png";
import GiftRecommendation from "../llm/GiftReccomendation";

const profiles = [
  { id: 1, name: "손윤지", description: "인물에 대한 간략 정보 1" },
  { id: 2, name: "정이진", description: "인물에 대한 간략 정보 2" },
  { id: 3, name: "정지은", description: "인물에 대한 간략 정보 3" },
  { id: 4, name: "김이화", description: "인물에 대한 간략 정보 4" },
];

const eventsData = [
  { text: "생일", action: "" },
  { text: "결혼", action: "" },
  { text: "연인 사이의 기념일", action: "" },
  { text: "어버이날", action: "" },
  { text: "입사", action: "" },
  { text: "합격축하", action: "" },
];

const priceData = [
  { text: "10000원 미만", value: "9999" },
  { text: "10000원 ~", value: "10000" },
  { text: "20000원 ~", value: "20000" },
  { text: "30000원 ~", value: "30000" },
  { text: "40000원 ~", value: "40000" },
  { text: "50000원 ~", value: "50000" },
  { text: "100000원 ~", value: "100000" },
];
const subCatData = [
  { text: "유아동" },
  { text: "주류" },
  { text: "금액권" },
  { text: "페스케어" },
  { text: "비타민" },
  { text: "무드등" },
  { text: "텀블러" },
  { text: "향수" },
  { text: "향기" },
  { text: "커피" },
  { text: "음료" },
  { text: "쿠키" },
  { text: "빙수" },
  { text: "차량" },
  { text: "반려동물" },
];

function Present() {
  const [currentPage, setCurrentPage] = useState("Profile");
  const [selectedProfile, setSelectedProfile] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [selectedSubCat, setSelectedSubCat] = useState([]);
  const [finalRecommendations, setFinalRecommendations] = useState([]);
  const [finalMessage, setFinalMessage] = useState(""); // 최종 메시지 상태

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedProfile = profiles.find((profile) => profile.name === selectedName);
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
    console.log("Here");
  }, []);

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

          <select className="select" value={selectedProfile?.name || ""} onChange={handleSelectChange}>
            <option value="">인물을 선택하세요</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.name}>
                {profile.name}
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
        <>
          <h1 className="text">선물 추천 결과</h1>
          <p>{finalMessage}</p>
        </>
      )}
    </div>
  );
}

export default Present;

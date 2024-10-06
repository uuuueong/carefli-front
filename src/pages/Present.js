import React, { useEffect, useState } from "react";
import "./Present.css"; // 스타일을 가져옴
import DynamicButtons from "../components/DynamicButtons";
import presentEventImg from "../image/presentEvent.png";
import presentWho from "../image/presentWho.gif";
import presentMoney from "../image/presentMoney.png";




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

function Present() {
  const [currentPage, setCurrentPage] = useState("Profile");
  const [selectedProfile, setSelectedProfile] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});

  const handleSelectChange = (event) => {
    const selectedName = event.target.value; // 선택된 이름이 들어옴
    const selectedProfile = profiles.find((profile) => profile.name === selectedName); // 이름으로 프로필 찾기
    setSelectedProfile(selectedProfile); // 해당 프로필을 저장
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

  const handlePriceDeSelect = (eventText) => {
    setSelectedPrice({});
  };
  const stateSetters = {
    Profile: setSelectedProfile,
    Event: setSelectedEvent,
    Price: setSelectedPrice,
  };
  const handleButtonClick = (page) => {
    setCurrentPage(page);
    const setFunction = stateSetters[page];
    if (setFunction) {
      setFunction({});
    }
    if (page === "Event") handlePriceDeSelect();
  };
  useEffect(() => {
    console.log(selectedProfile, selectedEvent, selectedPrice);
  }, [selectedProfile, selectedEvent, selectedPrice]);

  return (
    <div className="writing div-container">
      {currentPage === "Profile" && (
        <>
          <h1 className="text">누구를 위한<br /> 선물을 찾아볼까?</h1>
          <img src={presentWho} alt="presentWho" class="present-image" />

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
          <h1 className="text">무슨 날이야?<br/>이벤트를 선택해줘</h1>
          <img src={presentEventImg} alt="presentEventImg" class="present-image" />

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
          
          <h1 className="text">N원대의 <br /> 가격대가 좋을 것 같아 !</h1>
          <img src={presentMoney} alt="presentMoney" class="present-image" />


          <DynamicButtons
            buttonsData={priceData}
            onButtonClick={handlePriceSelect}
            onButtonDeselect={handlePriceDeSelect}
          />
          <div className="button-group">
            <button className="button" onClick={() => handleButtonClick("Event")}>
              뒤로: 이벤트 다시 선택하기
            </button>
            <button className="button" onClick={() => alert("선물 추천하기")}>
              결과 보기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Present;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Present.css"; // 스타일을 가져옴
import DynamicButtons from "../components/DynamicButtons";
import presentEventImg from "../image/presentEvent.png";
import presentWho from "../image/presentWho.gif";
import presentMoney from "../image/presentMoney.png";
import GiftRecommendation from "../llm/GiftReccomendation";
import presentMore from "../image/presentMore.gif";
import presentMore2 from "../image/presentMore2.gif";
import IconUrl from "../image/icon_url.png";
import axios from "axios";

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
  { text: "가전", value: "가전" },
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
];

function Present() {
  const location = useLocation();
  const initialProfile = location.state?.profile || "notSelected"; // location에서 프로필 받아오기
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState("Profile");
  const [selectedProfile, setSelectedProfile] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [selectedSubCat, setSelectedSubCat] = useState([]);
  const [finalRecommendations, setFinalRecommendations] = useState([]);
  const [presentList, setPresentList] = useState([]);
  const [finalMessage, setFinalMessage] = useState(""); // 최종 메시지 상태
  const [gifts, setGifts] = useState([]);
  const [likedGifts, setLikedGifts] = useState({});

  // 제외할 카테고리 목록
  const excludedCategories = ["금액권", "상품권", "유아동", "반려동물", "차량", "주류"];

  // selectedSubCat에 포함되지 않은 제외할 카테고리가 있는 경우 필터링
  const filteredPresentList = presentList.filter(
    (item) =>
      !excludedCategories.some(
        (excluded) =>
          !selectedSubCat.includes(excluded) && // selectedSubCat에 포함되지 않은 경우
          (item.category === excluded || item.subCategory === excluded) // category 또는 subCategory가 제외 항목과 일치
      )
  );

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

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = async (gift) => {
    const giftId = gift?.giftId;
    const connectionId = selectedProfile?.connectionId;
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `https://api.carefli.p-e.kr/gifts/like?giftId=${giftId}&connectionId=${connectionId}`, // giftId에 해당하는 API 호출
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Like Saved:", response.data); // 성공적으로 처리된 경우
      setLikedGifts((prevLikedGifts) => ({
        ...prevLikedGifts,
        [gift.giftId]: !prevLikedGifts[gift.giftId], // 클릭할 때마다 상태를 반전시킴
      }));
    } catch (error) {
      console.error("Like 업데이트 중 오류가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    setSelectedProfile(initialProfile);
    const accessToken = localStorage.getItem("accessToken");
    // 인맥 리스트 조회
    const fetchProfiles = () => {
      const cachedProfiles = localStorage.getItem("profiles");
      if (cachedProfiles) {
        setProfiles(JSON.parse(cachedProfiles));
      } else {
        const accessToken = localStorage.getItem("accessToken");
        axios
          .get(`https://api.carefli.p-e.kr/connections`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            localStorage.setItem("profiles", JSON.stringify(response.data));
            setProfiles(response.data);
          })
          .catch((err) => {
            console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
          });
      }
    };
    fetchProfiles();
  }, []);

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
    const fetchGifts = async () => {
      try {
        // finalRecommendations 배열을 쉼표로 연결하여 쿼리 스트링 생성
        const idsString = finalRecommendations.join(",");

        // axios로 서버에 GET 요청을 보냄 (쿼리 스트링에 giftIds 포함)
        const response = await axios.get(`https://api.carefli.p-e.kr/gifts/details?giftIds=${idsString}`);

        // 서버에서 받아온 데이터를 상태에 저장
        setGifts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("데이터를 받아오지 못했습니다:", error);
      }
    };

    const saveRecommendedGifts = async () => {
      // user Id local storage에 없을 경우 가져오기
      let userId = localStorage.getItem("user")?.userId || null;

      if (userId === null) {
        const accessToken = localStorage.getItem("accessToken");
        try {
          const response = await axios.get(`https://api.carefli.p-e.kr/users`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          localStorage.setItem("user", JSON.stringify(response.data));
          userId = response.data.userId; // 새로운 userId 값 저장
        } catch (err) {
          console.error("내 데이터를 가져오는 데 실패했습니다.", err);
          return; // 에러 발생 시 요청을 중단하고 종료
        }
      }

      // userId가 존재하는 경우, requestData 생성
      try {
        await axios.post("https://api.carefli.p-e.kr/gifts/recommended/save", {
          userId: userId,
          connectionId: selectedProfile?.connectionId,
          occasionType: selectedEvent?.value,
          giftIds: finalRecommendations,
        });
        console.log("Saved Presents");
      } catch (err) {
        console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
      }
    };

    // useEffect 안에서 비동기 함수 호출
    if (finalRecommendations.length > 0) {
      fetchGifts(); // 데이터 요청 함수 호출
      setCurrentPage("Gifts"); // 페이지 전환 로직도 함께 실행
      saveRecommendedGifts(); // 추천 선물 저장 로직 실행
    }
  }, [finalRecommendations, setCurrentPage, selectedProfile, selectedEvent]);

  return (
    <div className="writing div-container">
      {currentPage === "Profile" && (
        <>
          <h1 className="text">
            누구를 위한
            <br /> 선물을 찾아볼까?
          </h1>
          <img src={presentWho} alt="presentWho" className="present-image" />

          <select
            className="select"
            value={selectedProfile?.connectionName || ""}
            onChange={handleSelectChange}
            disabled={initialProfile !== "notSelected"} // initialProfile이 비어 있지 않으면 비활성화
          >
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
          <img src={presentMore2} alt="anymore" className="present-image" />

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
            {/* <GiftRecommendation
              presentList={presentList}
              selectedProfile={selectedProfile}
              selectedEvent={selectedEvent}
              selectedPrice={selectedPrice}
              selectedSubCat={selectedSubCat}
              setFinalRecommendations={setFinalRecommendations}
            /> */}
            <GiftRecommendation
              presentList={filteredPresentList} // 필터링된 presentList 전달
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

          <button
            className="save-button"
            onClick={async () => {
              try {
                const userId = localStorage.getItem("user")?.userId || selectedProfile?.userId;
                const requestBody = {
                  userId: userId,
                  connectionId: selectedProfile?.connectionId,
                  occasionType: selectedEvent?.value,
                  giftIds: gifts.map((gift) => gift.giftId),
                };

                const response = await axios.post(
                  "https://api.carefli.p-e.kr/gifts/recommended/save",
                  requestBody,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (response.status === 200) {
                  alert("선물 추천 리스트가 성공적으로 저장되었습니다!");
                } else {
                  alert("저장에 실패했습니다. 다시 시도해주세요.");
                }
              } catch (error) {
                console.error("선물 추천 리스트 저장 중 오류:", error);
                alert("오류가 발생했습니다. 저장할 수 없습니다.");
              }
            }}
            style={{
              padding: "10px 20px",
              margin: "20px 0",
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            저장하기
          </button>

          {gifts.map((gift) => (
            <div key={gift.giftId} className="gift-container">
              <div style={{ flex: 1 }}>
                <h2 className="gift-title">{gift.giftName}</h2>
                <p className="gift-price">가격: {gift.price.toLocaleString()}원</p>
                <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer">
                  <button className="gift-link">
                    <img
                      src={IconUrl}
                      alt="Icon"
                      style={{ width: "12px", height: "12px", marginRight: "8px", color: "white" }}
                    />
                    URL 바로가기
                  </button>
                </a>
              </div>

              <div className="image-container">
                <img
                  src={gift.giftImageUrl}
                  alt="제품 이미지"
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
                <button
                  className="like-button"
                  onClick={() => handleLikeClick(gift)}
                  style={{
                    fontSize: "18px",
                    cursor: "pointer",
                    backgroundColor: likedGifts[gift.giftId] ? "#ccc" : "#fff", 
                    border: "none",
                    borderRadius: "50%", 
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  👍
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Present;

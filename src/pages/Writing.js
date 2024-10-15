import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DynamicButtons from "../components/DynamicButtons";
import GenerateText from "../llm/GenerateText";
import "./Writing.css";
import axios from "axios";

const eventsData = [
  { text: "생일 축하", value: "생일" },
  { text: "결혼 축하", value: "결혼" },
  { text: "입사 축하", value: "입사" },
  { text: "합격 축하/기원", value: "합격" },
  { text: "졸업 축하", value: "졸업" },
];

const toneData = [
  { text: "존경심을 담아", value: "극존칭" },
  { text: "존댓말로", value: "존댓말" },
  { text: "친한 친구에게 반말로", value: "반말" },
];

const lengthData = [
  { id: 1, label: "100 자" },
  { id: 2, label: "200 자" },
  { id: 3, label: "300 자" },
  { id: 4, label: "400 자" },
  { id: 5, label: "500 자" },
];

const emojiData = [
  { id: "1", label: "Yes", value: true },
  { id: "2", label: "No", value: false },
];

function SelectWritingDetails() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedTone, setSelectedTone] = useState({});
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState();
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [eventIsSelected, setEventIsSelected] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});

  useEffect(() => {
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

  const handleSelectChange = (event) => {
    const selectedName = event.target.value; // 선택된 이름이 들어옴
    const selectedProfile = profiles.find((profile) => profile.connectionName === selectedName); // 이름으로 프로필 찾기
    setSelectedProfile(selectedProfile); // 해당 프로필을 저장
  };
  const handleEventSelect = (eventText) => {
    setSelectedEvent(eventsData.find((event) => event.text === eventText));
  };

  const handleEventDeSelect = (eventText) => {
    setSelectedEvent({});
  };

  const handleToneSelect = (toneText) => {
    setSelectedTone(toneData.find((tone) => tone.text === toneText));
  };
  const handleToneDeSelect = (toneText) => {
    setSelectedTone({});
  };

  const handleLengthSelect = (event) => {
    setSelectedLength(event.target.value); // Set the selected length based on the radio button's value
  };

  const handleEmojiSelect = (event) => {
    setSelectedEmoji(event.target.value === "true");
  };

  const handlePreviousClick = () => {
    navigate("/writing", { state: { selectedProfile } });
  };

  const handleNextClick = () => {
    setEventIsSelected(true);
  };

  const handlePreviousPage = () => {
    setEventIsSelected(false);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="writing div-container">
      {text.length === 0 &&
        (!eventIsSelected ? (
          <>
            <h1 className="text">누구를 위한 문구를 작성할까?</h1>
            <select className="select" value={selectedProfile?.connectionName || ""} onChange={handleSelectChange}>
              <option value="">인물을 선택하세요</option>
              {profiles.map((profile) => (
                <option key={profile.connectionId} value={profile.connectionName}>
                  {profile.connectionName}
                </option>
              ))}
            </select>
            <h1 className="text">무슨 일이 있는거야?</h1>
            <DynamicButtons
              buttonsData={eventsData}
              onButtonClick={handleEventSelect}
              onButtonDeselect={handleEventDeSelect}
            />
            <div className="button-group">
              <button className="button" onClick={handlePreviousClick}>
                이전
              </button>
              <button className="button" onClick={handleNextClick}>
                다음
              </button>
            </div>
          </>
        ) : (
          <div>
            <h1 className="text">말투는 어떻게?</h1>
            <DynamicButtons
              buttonsData={toneData}
              onButtonClick={handleToneSelect}
              onButtonDeselect={handleToneDeSelect}
            />
            <h1 className="text">문구의 길이는?</h1>
            <form style={{ padding: "0 60px" }}>
              {lengthData.map((option) => (
                <label key={option.id} style={{ display: "block", margin: "10px 0" }}>
                  <input
                    type="radio"
                    name="length"
                    value={option.label}
                    checked={selectedLength === option.label}
                    onChange={handleLengthSelect}
                  />
                  {option.label}
                </label>
              ))}
            </form>
            <h1 className="text">이모지 사용할까?</h1>
            <form>
              {emojiData.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="yesNo"
                    value={option.value}
                    checked={selectedEmoji === option.value}
                    onChange={handleEmojiSelect}
                  />
                  {option.label}
                </label>
              ))}
            </form>
            <div className="button-group">
              <button className="button" onClick={handlePreviousPage}>
                이전
              </button>
              <GenerateText
                selectedProfile={selectedProfile}
                selectedEvent={selectedEvent}
                selectedTone={selectedTone}
                selectedLength={selectedLength}
                selectedEmoji={selectedEmoji}
                setText={setText}
              />
            </div>
          </div>
        ))}
      {text.length > 0 && (
        <div>
          <h1>문구 작성 완료!</h1>
          {!isEditing ? (
            <>
              <p style={{ fontFamily: "Arial" }}>{text}</p>
              <div className="button-group">
                <button className="button" onClick={handleEdit}>
                  편집하기
                </button>
                <button className="button" onClick={() => alert("DB에 저장")}>
                  저장하기
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea value={text} className="text-area-edit" onChange={handleTextChange} />
              <button className="button" onClick={handleSave}>
                편집 완료
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectWritingDetails;

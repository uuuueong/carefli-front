import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DynamicButtons from "../components/DynamicButtons";
import GenerateText from "../llm/GenerateText";

const eventsData = [
  { text: "생일", action: "" },
  { text: "결혼", action: "" },
  { text: "어버이날", action: "" },
  { text: "입사", action: "" },
  { text: "합격 축하", action: "" },
  { text: "졸업 축하", action: "" },
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
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedTone, setSelectedTone] = useState({});
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState();
  const [text, setText] = useState("");

  const [eventIsSelected, setEventIsSelected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProfile } = location.state || {};

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

  useEffect(() => {
    console.log("here:", text);
  }, [text]);

  useEffect(() => {
    console.log(selectedTone);
  }, [selectedTone]);

  return (
    <div className="writing div-container">
      {text.length === 0 &&
        (!eventIsSelected ? (
          <>
            <h1 className="text">{selectedProfile?.name}님에게 무슨 일이 있는거야?</h1>
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
          {text}
        </div>
      )}
    </div>
  );
}

export default SelectWritingDetails;

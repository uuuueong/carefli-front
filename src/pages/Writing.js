import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DynamicButtons from "../components/DynamicButtons";
import GenerateText from "../llm/GenerateText";
import "./Writing.css";
import axios from "axios";
import AlertModal from "../components/AlertModal";
import giftText from "../image/giftText.gif";
import anyMore from "../image/anymoreWait.gif";
import { CopyToClipboard } from "react-copy-to-clipboard";

const eventsData = [
  { text: "생일", value: "생일" },
  { text: "결혼", value: "결혼" },
  { text: "입사", value: "입사" },
  { text: "합격", value: "합격" },
  { text: "졸업", value: "졸업" },
];

const toneData = [
  { text: "존경심을 담아", value: "극존칭" },
  { text: "존댓말로", value: "존댓말" },
  { text: "친한 친구에게 반말로", value: "반말" },
];

const lengthData = [
  { id: 1, label: "100 자", value: 100 },
  { id: 2, label: "200 자", value: 200 },
  { id: 3, label: "300 자", value: 300 },
  { id: 4, label: "400 자", value: 400 },
  { id: 5, label: "500 자", value: 500 },
];

const emojiData = [
  { id: "1", label: "Yes", value: true },
  { id: "2", label: "No", value: false },
];

function SelectWritingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialProfile = location.state?.profile || "notSelected"; // location에서 프로필 받아오기
  const [profiles, setProfiles] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedTone, setSelectedTone] = useState({});
  const [selectedLength, setSelectedLength] = useState({});
  const [selectedEmoji, setSelectedEmoji] = useState();
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [eventIsSelected, setEventIsSelected] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [showAlert, setShowAlert] = useState(false); // 알림 모달 표시 상태
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedProfile(initialProfile);
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

  // const handleLengthSelect = (lengthText) => {
  //   // setSelectedLength(lengthText.target.value); // Set the selected length based on the radio button's value
  //   setSelectedLength(lengthData.find((length) => length.text === lengthText));
  // };
  const handleLengthSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedLength(lengthData.find((length) => length.label === selectedValue));
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

  const handleSaveText = async () => {
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
        return; // 에러 발생 시 요청 데이터를 생성하지 않고 종료
      }
    }

    // userId가 존재하는 경우, requestData 생성
    const requestData = {
      userId: userId,
      connectionId: selectedProfile?.connectionId,
      occasionType: selectedEvent?.value,
      tone: selectedTone?.value,
      length: selectedLength?.value,
      text: text,
    };

    console.log(requestData);
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post(
        "https://api.carefli.p-e.kr/messages",
        {
          userId: userId,
          connectionId: selectedProfile?.connectionId,
          occasionType: selectedEvent?.value,
          tone: selectedTone?.value,
          length: selectedLength?.value,
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setAlertMessage("문구 저장 완료"); // 성공 시 메시지 설정
        setShowAlert(true); // 모달 표시
      })
      .catch((err) => {
        console.error("프로필 데이터를 가져오는 데 실패했습니다.", err);
      });
  };

  return (
    <div className="writing div-container">
      {text.length === 0 &&
        (!eventIsSelected ? (
          <>
            <h1 className="text">누구를 위한 문구를 작성할까?</h1>
            <img src={anyMore} alt="anyMore" className="present-image" />

            <select
              className="select"
              value={selectedProfile?.connectionName || ""}
              onChange={handleSelectChange}
              disabled={initialProfile !== "notSelected"}
            >
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
                    checked={selectedLength?.label === option.label}
                    onChange={handleLengthSelect} // 이벤트로 선택된 값을 처리
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
          <img src={giftText} alt="giftText" className="present-image" />
          <br />

          {!isEditing ? (
            <>
              <p style={{ fontFamily: "Arial" }}>{text}</p>
              <div className="button-group">
                <button className="button" onClick={handleEdit}>
                  편집하기
                </button>

                <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
                  <button className="button">
                    복사하기
                  </button>
                </CopyToClipboard>


                <button className="button" onClick={handleSaveText}>
                  저장하기
                </button>
                {showAlert && (
                  <AlertModal
                    message={alertMessage}
                    onClose={() => setShowAlert(false)} // 모달 닫기
                  />
                )}
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

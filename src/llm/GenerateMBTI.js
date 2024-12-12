import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

function GenerateMBTI({ name, age, relationship, setMBTI }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mbtiList, setMbtiList] = useState([]);
  const [buttonText, setButtonText] = useState("GPT를 이용해 MBTI 자동 생성하기!");
  const [connectionStats, setConnectionStats] = useState({});

  useEffect(() => {
    console.log("connectionStats: ", connectionStats);
  }, [connectionStats]);

  useEffect(() => {
    // 서버에서 프로필 데이터를 가져오는 함수
    const fetchConnections = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get("https://api.carefli.p-e.kr/connections", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const connections = response.data;
        calculateMBTIDistribution(connections);
      } catch (err) {
        console.error("데이터 가져오기 실패", err);
      }
    };

    fetchConnections(); // 컴포넌트가 렌더링될 때 서버에서 프로필 데이터 가져옴
  }, []);

  useEffect(() => {
    setMBTI(responseMessage);
  }, [responseMessage]);

  const calculateMBTIDistribution = (connections) => {
    const mbtiCount = {};
    const totalConnections = connections.length;

    connections.forEach((connection) => {
      const mbti = connection.mbti;
      if (mbti) {
        mbtiCount[mbti] = (mbtiCount[mbti] || 0) + 1;
      }
    });

    // 각 MBTI 비율 계산
    const mbtiDistribution = {};
    for (const [key, value] of Object.entries(mbtiCount)) {
      mbtiDistribution[key] = ((value / totalConnections) * 100).toFixed(2);
    }

    setConnectionStats(mbtiDistribution);
  };

  const mbtiTypes = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];

  const koreaMbtiDistribution = {
    ISFJ: 9.08,
    ISTJ: 8.89,
    INFP: 8.07,
    INFJ: 7.68,
    ENFP: 7.36,
    ISFP: 7.13,
    ENFJ: 6.61,
    ESFJ: 6.31,
    ESTJ: 6.11,
    ISTP: 5.97,
    INTJ: 5.37,
    ESFP: 5.21,
    INTP: 4.92,
    ENTJ: 4.87,
    ENTP: 3.61,
    ESTP: 2.81,
  };

  // const messages = [
  //   { role: "system", content: "너는 MBTI 성격 유형 16가지 중에 1개를 추측하는 챗봇이야." },
  //   {
  //     role: "system",
  //     content: `'${age}살이고, 나와 ${relationship} 관계입니다.
  //     전체 한국 MBTI 분포 데이터: ${JSON.stringify(koreaMbtiDistribution)}
  //     사용자의 인물 데이터 기반 MBTI 분포: ${JSON.stringify(connectionStats)}.
  //     이 데이터를 참고하여 어떤 유형의 MBTI 일지 추측해줘.'`,
  //   },
  //   {
  //     role: "system",
  //     content: `다음의 MBTI 유형 중 하나를 선택해줘: ${mbtiTypes.join(", ")}`,
  //   },
  //   { role: "system", content: "Take a guess and just respond in 4 letters." },
  //   { role: "user", content: "Guess the MBTI. 예: ESFP" },
  // ];

  const messages = [
    { role: "system", content: "너는 MBTI 성격 유형 16가지 중에 1개를 추측하는 챗봇이야." },
    {
      role: "system",
      content: `'${name}님은 ${age}살이고, 나와 ${relationship} 관계입니다.
      전체 한국 MBTI 분포 데이터: ${JSON.stringify(koreaMbtiDistribution)}
      그리고 사용자의 인물 데이터 기반 MBTI 분포: ${JSON.stringify(connectionStats)}.
      이 데이터를 참고하여 어떤 유형의 MBTI 일지 추측해줘.'`,
    },
    {
      role: "system",
      content: `다음의 MBTI 유형 중 하나를 선택해줘: ${mbtiTypes.join(", ")}`,
    },
    { role: "system", content: "Take a guess and just respond in 4 letters." },
    { role: "system", content: `'${mbtiList}' 말고 다른 MBTI로.` },
    { role: "user", content: "Guess the MBTI. ex: ESFP" },
  ];

  // const messages = [
  //   {
  //     role: "system",
  //     content: `너는 16가지 MBTI 성격 유형 중 하나를 추측하는 챗봇이야.
  //     ${name}님은 ${age}살이고, 나와 ${relationship} 관계입니다.
  //     MBTI 분포 데이터: ${JSON.stringify(mbtiDistribution)}를 참고하여 어떤 유형의 MBTI 일지 추측해줘.
  //     4글자의 MBTI 유형으로 추측하고, ${mbtiList}에 있는 MBTI 말고 다른 유형으로 추측해줘.`,
  //   },
  //   { role: "user", content: "MBTI를 추측해줘." },
  // ];

  const gptInput = {
    model: "gpt-4o-mini",
    temperature: 0.8,
    messages: messages,
  };

  const callGPT = async () => {
    setLoading(true);
    // setResponseMessage("");
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(gptInput),
      });

      const resultJSON = await response.json();

      if (resultJSON.choices && resultJSON.choices.length > 0) {
        const resultContent = resultJSON.choices[0].message.content;
        setResponseMessage(resultContent);
        setMbtiList((prevList) => (prevList.length >= 16 ? [resultContent] : [...prevList, resultContent]));
        setButtonText("다시 생성하기!");
      } else {
        console.error("No response from GPT");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      style={{
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "black",
        color: "white",
        cursor: "pointer",
        marginLeft: "auto",
        marginBottom: "-14px",
        display: "block",
        fontSize: "16px",
        fontFamily: "DungGeunMo",
      }}
      onClick={() => callGPT()}
    >
      {buttonText}
    </button>
  );
}

export default GenerateMBTI;

import React, { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

function GenerateMBTI({ name, age, relationship, setMBTI }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mbtiList, setMbtiList] = useState([]);
  const [buttonText, setButtonText] = useState("GPT를 이용해 MBTI 자동 생성하기!");

  useEffect(() => {
    setMBTI(responseMessage);
  }, [responseMessage]);

  const messages = [
    { role: "system", content: "너는 MBTI 성격 유형 16가지 중에 1개를 추측하는 챗봇이야." },
    {
      role: "system",
      content: `'${name}님은 ${age}살이고, 나와 ${relationship} 관계 입니다. 16가지 중 통계도 고려 조금 하고, 어떤 MBTI 일지 추측해줘!'`,
    },
    { role: "system", content: "Take a guess and just respond in 4 letters." },
    { role: "system", content: `'${mbtiList} 말고 다른 MBTI로.` },
    { role: "user", content: "Guess the MBTI." },
  ];

  const mbtiDistribution = {
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
        backgroundColor: "#5469c1",
        color: "white",
        cursor: "pointer",
        marginLeft: "auto",
        display: "block",
        marginBottom: "10px",
      }}
      onClick={() => callGPT()}
    >
      {buttonText}
    </button>
  );
}

export default GenerateMBTI;

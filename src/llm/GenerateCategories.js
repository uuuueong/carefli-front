import React, { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

function GenerateMBTI({ mbti, setCategories }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [buttonText, setButtonText] = useState("관심 카테고리 자동 유추하기!");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(mbti, responseMessage);
    const resultArray = responseMessage.trim().split(" "); // 공백을 기준으로 분할
    setCategories(resultArray);
  }, [responseMessage]);

  const subCategories = [
    "뷰티",
    "주류",
    "커피/음료",
    "디저트",
    "의류",
    "악세사리",
    "잡화",
    "반려동물",
    "유아동",
    "리빙",
    "건강",
    "식품",
    "디지털/가전",
    "도서/음반/티켓",
  ];

  const messages = [
    { role: "system", content: "너는 MBTI를 바탕으로 카테고리 3가지를 추측하는 챗봇이야." },
    { role: "system", content: `'무조건 ${subCategories} 중에서 3가지를 골라서 답변해줘.` },
    {
      role: "system",
      content: "대답을 '카테고리1 카테고리2 카테고리3'처럼 공백으로 구분된 형식으로만 답변해줘. 예: '뷰티 의류 잡화' ",
    },
    { role: "user", content: `${mbti}가 좋아할 것 같은 카테고리 3가지 추천해줘.` },
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

  const gptInput = {
    model: "gpt-4o-mini",
    temperature: 0.8,
    messages: messages,
  };

  const callGPT = async () => {
    setLoading(true);
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

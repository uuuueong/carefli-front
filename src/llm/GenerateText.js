import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const apiKey = process.env.REACT_APP_API_KEY;

function GenerateText() {
  // { event = "생일", tone = "반말", length = "100", useEmojis = true }
  const location = useLocation();
  const profile = location.state?.profile || {};
  const event = location.state?.event?.text || "생일";
  const tone = location.state?.tone.name || "반말";
  const length = location.state?.length || "100";
  const useEmojis = location.state?.useEmojis || false;

  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    callGPT();
    console.log(event);
  }, []);

  const emojiMessage = "🥳🎉🎂🎊🎁";
  const messages = [
    {
      role: "system",
      content: `너는 친절한 ${event}에 사용되는 챗봇이야. 점보다는 물결이나 느낌표를 많이 써.
      너는 ${tone}을 사용해 답변을 해야하고, 존댓말일 경우 생신과 같은 존칭 표현을 써야해.
      너는 ${length}자 내외(+-10자)의 답변을 줘야해.
      `,
    },
    {
      role: "system",
      content: useEmojis
        ? `${event}가 생일일 경우, 아래 예시들과 비슷하게 적어줘. 아래는 친구에게 보낸 예시들이고, 이모티콘은 ${emojiMessage} 이런 것들을 써줬으면 좋겠어. 생일 넘넘 축하해 행복과 응원을 잔뜩 받으며 즐거운 생일주간 보내길. 행복한 하루 보내. 생일 축하해~ 오늘 재밌고 즐거운 시간 보내.`
        : `${event}가 생일일 경우, 아래 예시들과 비슷하게 적어줘. 아래는 친구에게 보낸 예시들이야. 이모티콘은 쓰지 말아줘. 생일 넘넘 축하해 행복과 응원을 잔뜩 받으며 즐거운 생일주간 보내길. 행복한 하루 보내. 생일 축하해~ 오늘 재밌고 즐거운 시간 보내.`,
    },
    { role: "user", content: `Write me a text for ${event} in Korean` },
  ];

  const gptInput = {
    model: "gpt-4o-mini",
    temperature: 0.8,
    messages: messages,
  };

  const callGPT = async () => {
    setLoading(true);
    setResponseMessage("");
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(gptInput),
      });

      const resultJSON = await response.json();

      if (resultJSON.choices && resultJSON.choices.length > 0) {
        const resultContent = resultJSON.choices[0].message.content;
        setResponseMessage(resultContent);
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
    <div className="writing div-container">
      <h1 className="title">{profile.name}님을 위한 문구를 작성해봤어..!</h1>
      <p>{loading ? "응답을 작성 중입니다..." : "  " + responseMessage}</p>
    </div>
  );
}

export default GenerateText;

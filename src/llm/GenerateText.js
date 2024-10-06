import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createChatbotResponse } from "./AssistPrompt.js";

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
  }, []);

  const emojiMessage = "🥳🎉🎂🎊🎁";
  const assistPrompt = createChatbotResponse(event);
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
      content: useEmojis ? `이모티콘은 ${emojiMessage} 이런 것들을 2-3개 써줬으면 좋겠어.` : `이모티콘은 쓰지 말아줘.`,
    },
    {
      role: "system",
      content: assistPrompt,
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

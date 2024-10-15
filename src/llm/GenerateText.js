import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createChatbotResponse } from "./AssistPrompt.js";
import writingText from "../image/writingText.gif"

const apiKey = process.env.REACT_APP_API_KEY;

function GenerateText({ selectedProfile, selectedEvent, selectedTone, selectedLength, selectedEmoji, setText }) {
  const profile = selectedProfile || {};
  const event = selectedEvent?.text || "";
  const tone = selectedTone?.text || "";
  const length = selectedLength?.label || "100";
  const useEmojis = selectedEmoji || false;

  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setText(responseMessage);
  }, [responseMessage]);

  const emojiMessage = "🥳🎉🎂🎊🎁";
  const assistPrompt = createChatbotResponse(event);
  const messages = [
    {
      role: "system",
      content: `너는 친절한 ${event}에 사용되는 챗봇이야. 점보다는 물결이나 느낌표를 많이 써.
      너는 ${tone}을 사용해 답변을 해야하고, 존댓말일 경우 생신과 같은 존칭 표현을 써야해.
      너는 ${length} 내외(+-10자)의 답변을 줘야해.
      문구만 생성해줘.
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

  return !loading && responseMessage.length === 0 ? (
    <button className="button" onClick={() => callGPT()}>
      문구 생성하기
    </button>
  ) : (
    <div className="loading-container">
      <h1 className="text">문구 작성 중...</h1>
      <img src={writingText} alt="writingText" className="present-image" />
    </div>
  );
}

export default GenerateText;

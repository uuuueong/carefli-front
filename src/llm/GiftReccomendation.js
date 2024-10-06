import React, { useEffect, useMemo, useState } from "react";
import { getMbtiGiftPreference } from "./AssistPrompt";

// 선물 주는 상대방 정보
const person_info = {
  id: 1,
  connectionName: "정이진",
  mbti: "ESTP",
  relationship: "친구",
  interestTag: ["차량", "뷰티"],
};

// 선물 리스트 받아오기
const present_list = [
  {
    id: 1,
    name: "달바 '비건' 오리지널 미스트 세럼 선물 세트 (100ml+50ml)",
    price: 31900,
    category: "뷰티",
    url: "https://gift.kakao.com/product/5392498?tab=review&sortProperty=SCORE",
  },
  {
    id: 2,
    name: "나만의 비어캔 맥주잔 특별한 각인 술잔 남자 여자 친구 생일 자취 직장인 이사 신혼부부 선물 커플 하이볼잔 남친",
    price: 23900,
    category: "주류",
    url: "https://gift.kakao.com/product/10028370",
  },
  {
    id: 3,
    name: "아이스 카페 아메리카노 T 2잔 + 부드러운 생크림 카스텔라",
    price: 13500,
    category: "커피음료",
    url: "https://gift.kakao.com/product/7892633",
  },
  {
    id: 4,
    name: "[홍콩직수입] 제니베이커리 4믹스 쿠키(S) 320g",
    price: 29500,
    category: "디저트",
    url: "https://gift.kakao.com/product/1263462",
  },
  {
    id: 5,
    name: "차량용 무선 충전 거치대 핸드폰 휴대폰 자동차 고속 충전기 선물 (오그랩 맥스 차량용 무선충전거치대)",
    price: 29900,
    category: "차량",
    url: "https://gift.kakao.com/product/2071496",
  },
];

// Prop으로 받을 내용

const oneHotEncode = (categories, category) => categories.map((cat) => (cat === category ? 1 : 0));

const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

function GiftRecommendation({
  selectedProfile,
  selectedEvent,
  selectedPrice,
  selectedSubCat,
  setFinalRecommendations,
}) {
  const preferredCategories = selectedSubCat; // preferred categories here
  const excludedCategories = ["유아동", "반려동물", "차량", "주류"].filter((cat) => !selectedSubCat.includes(cat));
  // preferred 카테고리로 고르면, 제외 시키는 카테고리에서 빼기!

  const [recommendedGifts, setRecommendedGifts] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_API_KEY;

  // 2차 추천 알고리즘 - gpt를 이용한 추천 알고리즘
  useEffect(() => {
    if (recommendedGifts.length > 0) {
      callGPT();
      console.log(recommendedGifts);
    }
  }, [recommendedGifts]);

  useEffect(() => {
    if (responseMessage) {
      console.log(responseMessage);
      const finalRecommendations = responseMessage.split(" ").map(Number);
      setFinalRecommendations(finalRecommendations);
    }
  }, [responseMessage]);

  const formatPresentList = (list) => {
    return list
      .map(
        (item) =>
          `${item.name} (id: ${item.id}, Category: ${item.category}, Price: ${item.price}, Score: ${item.score})`
      )
      .join(", ");
  };

  const messages = useMemo(
    () => [
      // 사용자 종합 요약 정보
      {
        role: "system",
        content: getMbtiGiftPreference(),
      },
      {
        role: "system",
        content: `너는 ${person_info?.mbti}인 ${person_info?.relationship}를 위한 선물을 추천해주는 챗봇이야. 사용자는 ${person_info?.intersetTag}에 관심이 있어`,
      },
      {
        role: "system",
        content: `선물은 ${formatPresentList(recommendedGifts)} 중에서 추천해줘.
        이 데이터는 선물별로 선물 명, 카테고리, 점수 등이 있어. score는 컨텐츠 기반 알고리즘을 통해 1차로 추천된 선물 score결과야.
        이 사람의 mbti ${person_info?.mbti}를 제일 많이 고려해줬으면 좋겠어.
        답변은 추천된 상위 3가지의 id 3개를 무조건 우측과 같이 숫자 3개만 줘. 3 4 5
        `,
      },
      { role: "user", content: `Recommend three gifts` },
    ],
    [recommendedGifts]
  );

  const gptInput = {
    model: "gpt-4o-mini",
    temperature: 0.8,
    messages: messages,
  };

  const callGPT = async () => {
    console.log("GPT api called for Gift Recommendation");
    setLoading(true);
    setResponseMessage("");
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
        // setButtonText("다시 생성하기!");
      } else {
        console.error("No response from GPT");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 1차 추천 알고리즘 - contents algorithm
  const categories = useMemo(() => Array.from(new Set(present_list.map((item) => item.category))), []);
  const oneHotEncodedList = useMemo(
    () => present_list.map((item) => oneHotEncode(categories, item.category)),
    [categories]
  );

  const recommendGifts = () => {
    const scores = present_list
      .map((item, index) => {
        let totalSimilarity = 0;

        // Skip gifts in excluded categories
        if (excludedCategories.includes(item.category)) {
          return null; // Return null for excluded items
        }

        // Calculate similarity for each preferred category
        preferredCategories.forEach((preferredCategory) => {
          const userPreference = oneHotEncode(categories, preferredCategory);
          let similarity = cosineSimilarity(userPreference, oneHotEncodedList[index]);
          if (item.category === preferredCategory) {
            similarity *= 1.5; // Apply weighting factor
          }
          totalSimilarity += similarity; // Accumulate total similarity
        });

        return {
          ...item, // Spread all properties of the item
          score: (totalSimilarity / preferredCategories.length).toFixed(2), // Append the score
        };
      })
      .filter((score) => score !== null); // Filter out null values

    scores.sort((a, b) => b.score - a.score);
    setRecommendedGifts(scores);
  };

  return (
    <button className="button" onClick={recommendGifts}>
      선물 추천!
    </button>
  );
}

export default GiftRecommendation;

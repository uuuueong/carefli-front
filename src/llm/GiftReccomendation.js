import React, { useEffect, useMemo, useState } from "react";
import { getMbtiGiftPreference } from "./AssistPrompt";
import presentWho from "../image/presentWho.gif";

const oneHotEncode = (categories, category) => categories.map((cat) => (cat === category ? 1 : 0));

const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0; // Prevent division by zero
  return dotProduct / (magnitudeA * magnitudeB);
};

function GiftRecommendation({
  presentList,
  selectedProfile,
  selectedEvent,
  selectedPrice,
  selectedSubCat,
  setFinalRecommendations,
}) {
  // 선물 주는 상대방 정보
  const person_info = selectedProfile;
  const event = selectedEvent;
  const price = selectedPrice;
  const preferredCategories = selectedSubCat; // preferred categories here
  // 가격으로 필터링한 선물목록에서 해당 subcategory는 preferredCategories로 선택하지 않는 이상 제외시킨다.
  const excludedCategories = ["금액권", "상품권", "유아동", "반려동물", "차량", "주류"].filter(
    (cat) => !selectedSubCat.includes(cat)
  );

  const [recommendedGifts, setRecommendedGifts] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_API_KEY;

  // 2차 추천 알고리즘 - gpt를 이용한 추천 알고리즘
  useEffect(() => {
    if (recommendedGifts.length > 0) {
      console.log(recommendedGifts);
      console.log("selected info: ", selectedProfile, selectedEvent, selectedPrice, selectedSubCat);
      callGPT();
    }
  }, [recommendedGifts]);

  useEffect(() => {
    if (responseMessage) {
      const finalRecommendations = responseMessage.trim().split(" ").map(Number);
      setFinalRecommendations(finalRecommendations);
      // alert(
      //   `/gifts/recommended/save \n userId: ${selectedProfile?.userId},\n connectionId: ${selectedProfile?.connectionId},\n occasionType: ${selectedEvent?.value},\n giftIds: ${finalRecommendations}`
      // );
    }
  }, [responseMessage]);

  const formatPresentList = (list) => {
    return list
      .map(
        (item) =>
          `${item.giftName} (id: ${item.giftId}, Category: ${item.category}, Price: ${item.price}원, Score: ${item.score})`
      )
      .join("\n");
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
        답변은 추천된 상위 3가지의 giftId 3개를 ${formatPresentList(recommendedGifts)} 중에서 골라줘. 
        ${formatPresentList(recommendedGifts)}에서 3개의 선물을 고르고 그 giftId를 답변으로 줘.
        무조건 우측과 같이 숫자 3개만 줘.예를 들어 3 4 5
        `,
      },
      {
        role: "system",
        content: `사용자의 MBTI, ${
          person_info?.mbti
        },를 기반으로 선물을 추천해. 사용자의 관심사와 MBTI를 고려하여, 아래의 선물들 중 상위 3가지를 추천할게. 각 선물은 사용자의 성향과 잘 맞는 선물을 선별하기 위해 고려됐어. \n\n추천 선물 목록:\n${formatPresentList(
          recommendedGifts
        )}`,
      },
      { role: "user", content: `위 목록에서 선호하는 세 가지 선물의 id를 입력해주세요. 예:11 14 22` },
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
  const categories = useMemo(() => Array.from(new Set(presentList.map((item) => item.subCategory))), []);
  const oneHotEncodedList = useMemo(
    () => presentList.map((item) => oneHotEncode(categories, item.subCategory)),
    [categories]
  );

  const recommendGifts = () => {
    const scores = presentList
      .map((item, index) => {
        let totalSimilarity = 0;

        // Skip gifts in excluded categories
        if (excludedCategories.includes(item.subCategory)) {
          return null; // Return null for excluded items
        }

        // Calculate similarity for each preferred category
        preferredCategories.forEach((preferredCategory) => {
          const userPreference = oneHotEncode(categories, preferredCategory);
          let similarity = cosineSimilarity(userPreference, oneHotEncodedList[index]);
          if (item.subCategory === preferredCategory) {
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

  return !loading && responseMessage.length === 0 ? (
    <button className="button" onClick={recommendGifts}>
      선물 추천!
    </button>
  ) : (
    <div className="loading-container">
      <h1 className="text">선물 추천 중...</h1>
      <img src={presentWho} alt="presentWho" className="present-image" />
    </div>
  );
}

export default GiftRecommendation;

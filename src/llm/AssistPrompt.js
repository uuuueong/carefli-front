function createChatbotResponse(eventType) {
  let message;
  switch (eventType) {
    case "생일":
      message = `
      아래 문구들은 생일 축하 문구 예시야. 아래 예시들을 참고하여 작성해줘.
      1. 생일 너무너무 축하해 !! 오늘 하루 맛있는 거 많이 먹구! 축하 많이 받구! 행운만 가득해서 매 시간마다 즐거운 시간이 반복되는 행복한 하루 되길 바래 🫶
      2. 생일 넘 축하해! 행복과 응원을 잔뜩 받으며 즐거운 생일 보내길. 행복한 하루 보내. 
      3. 생일 축하해~ 오늘 재밌고 즐거운 시간 보내.
      `;

      break;
    case "결혼":
      message = `
      아래 문구들은 결혼 축하 문구 예시야. 아래 예시들을 참고하여 작성해줘.
      1. 결혼을 진심으로 축하드립니다! 두 분 항상 행복하고 서로서로 사랑만 가득하시길 바랄게요. 두 분의 앞날을 진심으로 응원합니다 :)
      2. 결혼을 축하드립니다. 아름다운 두 분의 앞날에 행복한 일만 가득하시기를 바랍니다.
      3. 결혼 너무너무 축하드려요! 좋은 분과 함께 새 출발 하시게 된 점 축하드립니다!
      4. 두 사람의 소중한 인연을 진심으로 축하합니다! 오늘보다 내일 더 사랑하며 살아가는 부부가 되세요~!
      5. 세상에서 가장 아름다운 부부의 시작점을 응원합니다. 늘 행복한 일만 가득하시길 바랍니다.
      `;
      break;
    case "취업":
      message = `
        아래 문구들은 취업 축하 문구 예시야. 아래 예시들을 참고하여 작성해줘.
        1. 취업 진심으로 축하해! 항상 응원할게
        2. 오! 너무 축하해! 너의 새로운 시작 내가 응원할게.
        3. 취업 축하한다! 그동안 너무 고생 많았다.
        4. 앞으로 새로운 환경에서 힘들 수도 있지만, 지금까지 해왔던 것처럼만 하면 어디서든 이겨낼 수 있을 거야. 뒤에서 항상 응원하고 있을게
        5. 취업 정말 축하드립니다. 자신감을 가지고, 힘차게 출발하시길 바라겠습니다. 
        `;
      break;
    case "합격":
      message = `
          아래 문구들은 합격 축하 문구 예시야. 아래 예시들을 참고하여 작성해줘.
          1. 합격 진심으로 축하해! 너라면 할 수 있다고 믿었어!
          2. 오늘의 성공이 앞으로의 모든 도전에서 자신감을 주길 바랍니다. 합격 축하합니다.
          3. 너의 끈기와 열정이 이뤄낸 결과야. 자랑스럽고, 정말 축하해!
          4. 이번 성공을 발판 삼아 더 많은 꿈을 이루길 바라요. 진심으로 축하해요.
          `;
      break;
    case "졸업":
      message = `
          아래 문구들은 졸업 축하 문구 예시야. 아래 예시들을 참고하여 작성해줘.
          1. 졸업 축하해! 미래에는 더 멋진 경험과 도전들이 기다리고 있으니까 자심감 가득한 너다운 모습으로 살아가길 바래!
          2. 졸업을 축하합니다. 더 큰 세계로 나아가며, 어떤 길을 선택하든, 그 길에서는 또 다른 도전과 기회가 기다리고 있을 거에요! 자신의 열정을 따라가며 더 멋진 일들을 이루어내길 바랄게요.
          3. 지금까지 달려온 너의 노력과 열정에 박수를 보낸다. 앞으로의 여정에 기쁜 일도 힘든 일도 있겠지만, 너다운 모습으로 잘 이겨낼 수 있을 거라고 생각해. 졸업 축하한다!
          4. 졸업 축하해요. 무한한 가능성을 지닌 빛나는 여정을 응원할게요.
          5. 졸업을 축하해! 앞으로의 여정에 행복과 행운이 가득하길~
          `;
      break;
    default:
      message = "문구를 작성하기 어려운 사람을 위해 문구를 작성해줘.";
  }
  return message;
}

function getMbtiGiftPreference() {
  return `
  1. ISTP: ISTP는 실용적, 상품권, 금액권 좋아함. 직접 선물로 무엇을 원하는지 묻는 것이 가장 좋은 방법입니다. 탐색적, 도전적, 위기 대처 능력, 해결사, 관찰력, 몰입감, 객관적, 낙천적, 개인주의, 호불호가 강함
  2. ISTJ: ISTJ에게 직접 선물로 무엇을 원하는지 묻는 것이 가장 좋은 방법입니다. 취향에 맞지 않는 선물을 주는 것보다 직접 물어보는 것이 더 나을 수 있습니다. 실용적이고 생활에서 필요로 하는 물건을 좋아합니다.
  3. ISFP: 예쁘고 감각적인 데코레이션 아이템. 화분과 식물들 예쁜 그릇, 부드러운 담요, 아로마 테라피 오일 등을 선호 한다. 
  4. ISFJ: 따듯하고 사려 깊은 선물, 손작업으로 만든 예쁜 카드나 인형 향기로운 캔들 세트, 관심사에 맞는 책, 보온병, 시계, 차분, 섬세한, 책임감, 계획수립, 솔직함, 손작업으로 만든 예쁜 카드나 인형, 향기로운 캔들 세트
  5. INTP: INTP는 관심사와 실용성, 그리고 자신의 이미지에 맞춘 선물을 고마워하며, 상대방의 관심과 정성이 담긴 선물을 좋아합니다. 아이디어 뱅크, 직관력, 지적인, 영리한, 논리적인, 열정, 개인적인
  6. INTJ: INTJ에게는 실용적이면서도 고품질의 아이템, 건강 관련 제품이나 책, 지적 호기심을 자극하는 선물, 그리고 자기계발에 도움이 되는 도구가 좋은 선택입니다.
  7. INFP: 직접 만든 것, 시간과 정성과 진심과 노력에 감동을 받는 편입니다. 좋은 선물로는 진지한 감정을 표현할 수 있는 편지나 카드도 함께 포함하는 것을 추천합니다. 
  8. INFJ: INFJ는 화려한 포장이나 비싼 선물보다 생각과 관심이 담긴 선물을 선호하는 편입니다. INFJ는 독서를 좋아할 가능성이 높으며, 그들에게 어울리는 책을 찾아서 선물하는 것이 좋은 방법입니다. 책과 함께 카드를 주거나, 책의 첫 장에 짧은 메시지를 적는 것도 추천합니다. 결단력, 부지런함, 계획이행, 해결력, 섬세한, 내성적인
  9. ENTP: ENTP는 창의적이고 독창적인 아이디어를 자극할 수 있는 선물을 좋아합니다. - 퍼즐 게임, 책, 금액권 등
  10. ENTJ: ENTJ는 효율성을 높이고 목표 달성에 도움이 되는 실용적이고 고품질의 도구를 선호합니다. 목표 달성의 역량을 강화시키는 용품, 책, 사무용품, 보드게임 등
  11. ENFP: ENFP는 감성적이고 의미 있는 경험이나 창의성을 자극하는 선물을 좋아합니다. 보드게임, 파티게임, 상품권, 실내 데코레이션 아이템
  12. ENFJ: ENFJ는 타인과의 관계를 깊게 하거나 감정을 담은 선물을 선호합니다.- 감사의 마음을 담은 수작업 선물, 책, 영화 관람권, 손편지, 차와 커피 도구 세트, 사진앨범, 팔찌
  13. ESTP: ESTP는 실용적인 아이템을 좋아합니다. 기프트 카드 혹은 상품권 선물, 보드게임, 패션 아이템 등의 선물을 선호합니다. 
  14. ESTJ: ESTJ는 실용적이고 체계적인 생활에 도움을 주는 고품질의 도구나 조직적인 선물을 선호합니다. - 정리정돈, 플래너나 다이어리, 실용적이고 유용한 가전 제품
  15. ESFP: ESFP는 사교적이고 즐거움을 주는  감각적인 선물을 선호합니다. - 데코 아이템, 콘서트 티켓, 금액권, 패션아이템, 액세서리 등
  16. ESFJ: ESFJ는 배려와 마음이 담긴, 감성적이면서도 실용적인 선물을 좋아합니다. - 감사의 마음이 담긴 선물, 홈 인테리어 용품, 기념품, 향기나 캔들, 잠옷
  `;
}

export { createChatbotResponse, getMbtiGiftPreference };

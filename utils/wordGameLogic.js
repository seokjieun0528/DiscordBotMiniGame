const fetch = require("node-fetch");
const xml2js = require("xml2js"); // 사전 API는 xml로 보내기 때문에 json으로 변환하기 위한 모듈 설치
const { API_KEY } = require("../config.json");

async function getBotWord(previousWord) {
  if (!previousWord || typeof previousWord !== "string") {
    throw new Error("이전 단어가 올바르지 않습니다.");
  }

  const lastChar = previousWord.slice(-1);

  const url = `http://opendict.korean.go.kr/api/search?key=${API_KEY}&req_type=xml&q=${encodeURIComponent(
    lastChar
  )}&num=100`;

  // API 요청, XML 형식으로 응답
  const response = await fetch(url);
  const xml = await response.text();

  // XML -> JSON
  const parser = new xml2js.Parser({ explicitArray: false });
  const result = await parser.parseStringPromise(xml);

  const items = result.channel?.item;

  if (!items) {
    console.log("API 응답에 단어 항목이 없습니다:", xml);
    throw new Error("단어를 찾을 수 없습니다.");
  }

  // 국립국어원에서 num만큼 반복해서 검색한 결과를 배열 형태로 반환
  const wordItems = Array.isArray(items) ? items : [items];

  // 마지막 글자로 시작하고 두 글자 이상인 단어만
  const words = wordItems
    .map((item) => item.word) // item에서 word라는 속성만 꺼내서 배열로 만듬
    .filter((word) => word.startsWith(lastChar) && word.length > 1); // 조건에 맞는 배열만 남김ㄴ

  if (words.length === 0) {
    throw new Error("적절한 단어를 찾지 못했습니다.");
  }

  const random = words[Math.floor(Math.random() * words.length)];
  return random;
}

// 사용자가 입력한 단어가 국어사전에 존재하는지 검사
async function isValidWord(word) {
  if (!word || typeof word !== "string") return false;
  if (word.length < 2) return false;

  try {
    const num = 10; // num 숫자 10 이상이여야함
    const query = encodeURIComponent(word);
    const url = `http://opendict.korean.go.kr/api/search?key=${API_KEY}&req_type=xml&q=${query}&num=${num}`;

    // console.log("API 호출 URL:", url);
    // console.log("API_KEY:", API_KEY);

    const response = await fetch(url);
    const xml = await response.text();

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);

    if (result.error) {
      console.log("API 에러 응답:", result.error);
      return false;
    }

    const items = result.channel?.item;
    if (!items) return false;

    const wordItems = Array.isArray(items) ? items : [items];
    return wordItems.some(
      (item) => item.word.trim().toLowerCase() === word.trim().toLowerCase()
    );
  } catch (error) {
    console.error("isValidWord error:", error);
    return false;
  }
}

module.exports = { getBotWord, isValidWord };

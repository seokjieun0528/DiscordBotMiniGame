const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "wordRelayChannels.json");

// 채널 목록 불러오기
function loadChannels() {
  try {
    if (!fs.existsSync(filePath)) return new Set();
    const raw = fs.readFileSync(filePath, "utf-8");
    const ids = JSON.parse(raw); // JSON -> 배열
    return new Set(ids); // 배열 -> Set(중복 없는 채널 ID를 저장하기 위해 set사용)
  } catch (err) {
    console.error("❌ 끝말잇기 채널 목록 로드 실패:", err);
    return new Set();
  }
}

// 채널 목록 저장
function saveChannels(set) {
  try {
    const array = Array.from(set);
    fs.writeFileSync(filePath, JSON.stringify(array, null, 2));
  } catch (err) {
    console.error("❌ 끝말잇기 채널 목록 저장 실패:", err);
  }
}

module.exports = { loadChannels, saveChannels };

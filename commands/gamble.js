const db = require("../db");

module.exports = async (message) => {
  const args = message.content.split(" ");
  const userId = message.author.id;

  db.query(
    "SELECT * FROM userGamble  WHERE user_id = ?",
    [userId],
    (err, results) => {
      console.log("DB 연결 정보 - user:", process.env.DB_USER);
      if (err) {
        console.log("DB 조회 오류", err);

        return message.reply("오류가 발생했습니다");
      }

      // db 연결 확인
      //   if (results.length === 0) {
      //     console.log(`[${userId}] DB에 정보 없음`);
      //     return message.reply("📭 아직 데이터가 없습니다.");
      //   } else {
      //     console.log(`[${userId}] DB 조회 결과:`, results[0]);
      //     return message.reply(`🔍 현재 잔액은 ${results[0].money}원입니다.`);
      //   }
    }
  );
};

const db = require("../db");

module.exports = async (interaction, amount) => {
  if (!interaction || !interaction.user) {
    console.error("❌ interaction 또는 interaction.user가 없습니다.");
    return;
  }

  const userId = interaction.user.id;

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

      // !도박 만 입력한 경우
      if (err) {
        console.error("DB 조회 오류:", err);
        return interaction.reply("❗ 오류가 발생했습니다.");
      }

      if (amount === null) {
        // 초기 접속 처리
        if (results.length === 0) {
          db.query(
            "INSERT INTO userGamble (user_id, money) VALUES (?, ?)",
            [userId, 10000],
            (err) => {
              if (err) return interaction.reply("❗ 초기화 중 오류 발생");
              return interaction.reply(
                "🎉 첫 접속! 10,000원이 지급되었습니다."
              );
            }
          );
        } else {
          return interaction.reply("✅ 이미 초기 자금을 지급받았습니다.");
        }
        return;
      }
    }
  );
};

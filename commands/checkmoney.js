const db = require("../db");

module.exports = async (interection) => {
  if (!interection || !interection.user) {
    console.error("interaction 또는 interaction.user가 없음");
    return;
  }

  const userId = interection.user.id;

  db.query(
    "SELECT * FROM userGamble WHERE user_id = ? order by money desc",
    [userId],
    (err, results) => {
      console.log("DB 연결 정보 - user", process.env.DB_USER);
      if (err || results.length === 0) {
        console.log("DB 조회 오류", err);
        return interection.reply("오류가 발생했습니다.");
      }

      const money = results[0].money;
      interection.reply(`현재 잔액은 ${money}입니다`);
    }
  );
};

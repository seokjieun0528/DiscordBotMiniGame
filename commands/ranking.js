const db = require("../db");

module.exports = async (interaction) => {
  if (!interaction || !interaction.user) {
    console.error("interaction 또는 interaction.user가 없음");
    return;
  }

  const userId = interaction.user.id;

  db.query(
    "SELECT * FROM userGamble order by money desc LIMIT 3",
    async (err, results) => {
      console.log("DB 연결 정보 - user", process.env.DB_USER);
      if (err || results.length === 0) {
        console.log("DB 조회 오류", err);
        return interaction.reply("오류가 발생했습니다.");
      }

      let rankList = [];

      // 1등부터 3등까지 랭킹을 리스트로 저장
      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        try {
          const user = await interaction.client.users.fetch(row.user_id);
          rankList.push(`${i + 1}등: ${user.username} - ${row.money}원`);
        } catch (err) {
          console.error("알 수 없는 사용자");
        }
      }

      // const rank = results
      //   .map((row, idx) => `${idx + 1}.${username} - ${row.money}원`)
      //   .join("\n");

      const reply = `🏆 랭킹 TOP 3\n` + rankList.join("\n");
      interaction.reply(reply);
    }
  );
}; // module

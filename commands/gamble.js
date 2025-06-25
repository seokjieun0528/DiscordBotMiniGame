const db = require("../db");
const moment = require("moment");

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
              return interaction.reply("🎉 10,000원이 지급되었습니다.");
            }
          );
        } else {
          return interaction.reply("✅ 이미 초기 자금을 지급받았습니다.");
        }
        return;
      } // if

      // 금액이 입력된 경우
      if (results.length === 0) {
        // 등록된 유저가 아님 → 초기화 후 재시도 요청
        db.query(
          "INSERT INTO userGamble (user_id, money) VALUES (?, ?)",
          [userId, 10000],
          (err) => {
            if (err) return interaction.reply("❗ 초기화 중 오류 발생");
            return interaction.reply(
              "📥 처음 접속이므로 10,000원이 지급되었습니다. 다시 `/도박 금액`으로 시도해주세요."
            );
          }
        );
        return;
      } // if

      const user = results[0];
      const today = moment().format("YYYY-MM-DD");
      const lastDate = moment(user.last_gamble).format("YYYY-MM-DD");

      // let gambleCount = user.gamble_count;

      // if (today !== lastDate) {
      //   gambleCount = 0;
      // }

      let replyMessage = "";
      // let gambleCount = today != lastDate ? 0 : user.gamble_count;
      let gambleCount = user.gamble_count;
      if (today != lastDate) {
        console.log("lastDate" + lastDate);
        console.log("today" + today);
        gambleCount++;
      }

      if (gambleCount >= 5) {
        return interaction.reply(
          "오늘 도박 가능 횟수(5회)를 모두 사용했습니다."
        );
      }

      let money = user.money;
      gambleCount += 1;

      if (money < amount) {
        return interaction.reply(`💸 잔액이 부족합니다. 현재 잔액: ${money}원`);
      }

      const result = Math.random() < 0.5 ? "UP" : "DOWN";

      if (result === "UP") {
        money += amount;
        replyMessage = `🎉 성공! ${amount}원 획득! 현재 잔액: ${money}원(${gambleCount}/5)`;
        console.log(gambleCount);
      } else {
        money -= amount;
        if (money <= 0) {
          // 실패 + 삭제 메시지를 하나로 합침
          db.query(
            "DELETE FROM userGamble WHERE user_id = ?",
            [userId],
            (err) => {
              if (err) {
                console.error("❌ 사용자 삭제 오류:", err);
                return interaction.reply(
                  "실패하여 잔액이 0원이 되었지만, 사용자 삭제 중 오류가 발생"
                );
              }

              return interaction.reply(
                `😢 실패... ${amount}원 잃음.\n💥 잔액이 0원이 되어 초기화되었습니다. 다음에 다시 /도박 으로 시작해주세요!`
              );
            }
          );
          return; // 여기서 끝냄
        } else {
          replyMessage = `😢 실패... ${amount}원 잃음. 현재 잔액: ${money}원(${gambleCount}/5)`;
        }
      }

      if (replyMessage) {
        interaction.reply(replyMessage);
      } else {
        interaction.reply("오류발생");
      }

      db.query(
        "UPDATE userGamble SET money = ?, gamble_count = ?, last_gamble = ? WHERE user_id = ?",
        [money, gambleCount, moment().format("YYYY-MM-DD HH:mm:ss"), userId]
      ); // update
    }
  ); // db.query
};

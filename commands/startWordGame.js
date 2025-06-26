const gameStates = require("../gameStates");
const { getBotWord } = require("../utils/wordGameLogic");

module.exports = async (interaction) => {
  const channelId = interaction.channel.id;

  if (gameStates[channelId]) {
    return interaction.reply({
      content: "⚠️ 이미 끝말잇기 게임이 진행 중입니다!",
      ephemeral: true,
    });
  }

  try {
    await interaction.deferReply(); // 즉시 응답 지연

    const botWord = await getBotWord("시작", []);

    gameStates[channelId] = {
      lastWord: botWord,
      usedWords: [botWord],
      turn: "user",
    };

    await interaction.editReply(
      `🧠 끝말잇기 시작! 제가 먼저 할게요: **${botWord}**\n당신의 차례입니다! 단어를 입력해주세요.`
    );
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "⚠️ 명령어 처리 중 오류가 발생했습니다.",
        ephemeral: true,
      });
    } else {
      await interaction.editReply("⚠️ 명령어 처리 중 오류가 발생했습니다.");
    }
  }
};

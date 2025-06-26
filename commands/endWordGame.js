const gameStates = require("../gameStates");

module.exports = async (interaction) => {
  const channelId = interaction.channel.id;

  if (!gameStates[channelId]) {
    return interaction.reply({
      content: "❌ 이 채널에서 진행 중인 끝말잇기 게임이 없습니다.",
      ephemeral: true,
    });
  }

  delete gameStates[channelId];
  await interaction.reply("🔚 끝말잇기 게임이 종료되었습니다.");
};

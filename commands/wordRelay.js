module.exports = async (interaction) => {
  try {
    await interaction.reply("✏️ 끝말잇기를 시작합니다! 단어를 입력해 주세요.");
  } catch (err) {
    console.error("끝말잇기 처리 중 오류:", err);
    await interaction.reply("⚠️ 끝말잇기 실행 중 오류가 발생했습니다.");
  }
};

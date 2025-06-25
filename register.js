const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

// 슬래시 명령어 등록
const commands = [
  new SlashCommandBuilder()
    .setName("도박")
    .setDescription("도박을 시작합니다.")
    .addIntegerOption((option) =>
      option.setName("금액").setDescription("베팅할 금액").setRequired(false)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("잔액")
    .setDescription("현재 잔액을 확인합니다.")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("랭킹")
    .setDescription("랭킹을 확인합니다.")
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("슬래시 명령어 등록 중...");
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log("✅ 슬래시 명령어 등록 완료!");
  } catch (error) {
    console.error("슬래시 명령어 등록 실패:", error);
  }
})();

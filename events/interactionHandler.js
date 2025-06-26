const { Events } = require("discord.js");
const { loadChannels, saveChannels } = require("../utils/wordRelayChannels");
const gambleCommand = require("../commands/gamble");
const checkmoney = require("../commands/checkmoney");
const ranking = require("../commands/ranking");
const startWordGame = require("../commands/startWordGame");
const endWordGame = require("../commands/endWordGame");

// 등록된 끝말잇기 채널 목록
const registeredWordRelayChannels = loadChannels();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === "도박") {
          const amount = interaction.options.getInteger("금액");
          return await gambleCommand(interaction, amount);
        }

        if (commandName === "잔액") {
          return await checkmoney(interaction);
        }

        if (commandName === "랭킹") {
          return await ranking(interaction);
        }

        if (commandName === "끝말잇기등록") {
          const channelId = interaction.channel.id;

          if (registeredWordRelayChannels.has(channelId)) {
            return await interaction.reply({
              content: "📌 이 채널은 이미 끝말잇기 채널로 등록되어 있습니다.",
              ephemeral: true,
            });
          }

          registeredWordRelayChannels.add(channelId);
          saveChannels(registeredWordRelayChannels);
          return await interaction.reply(
            "✅ 이 채널이 끝말잇기 채널로 등록되었습니다!"
          );
        }

        if (commandName === "끝말잇기") {
          if (!registeredWordRelayChannels.has(interaction.channel.id)) {
            return await interaction.reply({
              content: "❌ 이 채널은 끝말잇기 채널로 등록되어 있지 않습니다.",
              ephemeral: true,
            });
          }

          return await startWordGame(interaction);
        }

        if (commandName === "끝말잇기종료") {
          const channelId = interaction.channel.id;

          if (!registeredWordRelayChannels.has(channelId)) {
            return await interaction.reply({
              content: "❌ 이 채널은 끝말잇기 채널로 등록되어 있지 않습니다.",
              ephemeral: true,
            });
          }

          return await endWordGame(interaction);
        }
      }
    } catch (err) {
      console.error("❌ Interaction 처리 중 에러:", err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "⚠️ 명령어 처리 중 오류가 발생했습니다.",
          ephemeral: true,
        });
      }
    }
  },
};

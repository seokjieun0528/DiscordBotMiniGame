const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const gambleCommand = require("./commands/gamble");

// 클라이언트 객체 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`로그인 준비 ${readyClient.user.tag}`);
});

//!hi라는 메시지를 받으면 "안녕!"이라고 대답하기
// client.on("messageCreate", (message) => {
//   if (message.content == "!hi") {
//     message.reply("안녕!");
//   }
// });

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "도박") {
    const amount = interaction.options.getInteger("금액");
    await gambleCommand(interaction, amount); // 수정 필요
  }
});

client.login(token);

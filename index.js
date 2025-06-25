const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const gambleCommand = require("./commands/gamble");
const checkmoney = require("./commands/checkmoney");

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

// interaction : 슬래시 명령어가 실행될 때 전달되는 객체
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "도박") {
    const amount = interaction.options.getInteger("금액");
    await gambleCommand(interaction, amount);
  }

  if (interaction.commandName === "잔액") {
    await checkmoney(interaction);
  }
});

client.login(token);

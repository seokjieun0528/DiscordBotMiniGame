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

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  else if (message.content.startsWith("!도박")) {
    await gambleCommand(message);
  }
});

client.login(token);

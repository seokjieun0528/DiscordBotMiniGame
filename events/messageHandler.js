const { Events } = require("discord.js");
const gameStates = require("../gameStates");
const { isValidWord, getBotWord } = require("../utils/wordGameLogic");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // 자기 자신에게 반응을 방지
    if (message.author.bot) return;

    const channelId = message.channel.id;
    const word = message.content.trim();
    const game = gameStates[channelId];

    if (!game || game.turn !== "user") return;

    // 이전 단어의 마지막 글자와 비교
    const lastChar = game.lastWord.slice(-1);
    if (word[0] !== lastChar) {
      delete gameStates[channelId];
      return message.reply(
        `❌ '${word}'는 '${lastChar}'로 시작하지 않아요. 당신의 패배입니다!`
      );
    }

    if (!(await isValidWord(word))) {
      delete gameStates[channelId];
      return message.reply(
        `❌ '${word}'는 사전에 없는 단어예요. 당신의 패배입니다!`
      );
    }

    if (game.usedWords.includes(word)) {
      delete gameStates[channelId];
      return message.reply(
        `❌ '${word}'는 이미 사용했어요. 당신의 패배입니다!`
      );
    }

    game.usedWords.push(word);
    const botWord = await getBotWord(word.slice(-1), game.usedWords);

    if (!botWord) {
      delete gameStates[channelId];
      return message.reply(
        `🎉 '${word}' 까지! 당신이 이겼어요. 제가 더 이상 단어를 모르겠네요.`
      );
    }

    game.lastWord = botWord;
    game.usedWords.push(botWord);
    game.turn = "user";

    await message.reply(`🤖 봇: **${botWord}**\n당신의 차례입니다!`);
  },
};

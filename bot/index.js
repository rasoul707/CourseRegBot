const { Bot } = require("grammy");
require("dotenv").config();


const token = process.env.TELEGRAM_BOT_TOKEN;
console.log(token)
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(token); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start().then(r => {
    console.log("kkkkkkkkk")
    bot.api.sendMessage(115025624, "Hello this is test message")
});
import {Bot} from "grammy";

export const sendMessage2User = async (chat_id: number, text: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");

    const bot = new Bot(token);
    await bot.api.sendMessage(chat_id, text, {parse_mode: "MarkdownV2"})
}
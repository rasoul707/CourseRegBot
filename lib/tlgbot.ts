import {Bot, InlineKeyboard} from "grammy";

export const sendMessage2User = async (chat_id: number, text: string, withSupportButton: boolean = false) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");

    const bot = new Bot(token);
    if (withSupportButton) {
        // @ts-ignore
        const s = await prisma.Setting.findUnique({
            where: {id: 1},
        })
        const keyboard = new InlineKeyboard()
        if (s?.supportUsername) {
            keyboard.url("پشتیبانی", "https://t.me/" + s.supportUsername).row()
            await bot.api.sendMessage(chat_id, text, {parse_mode: "MarkdownV2", reply_markup: keyboard})
        }
    }
    await bot.api.sendMessage(chat_id, text, {parse_mode: "MarkdownV2"})
}



export const sendNotify2AdminChanel = async (text: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");

    const bot = new Bot(token);

    // @ts-ignore
    const s = await prisma.Setting.findUnique({
        where: {id: 1},
    })

    if(s.adminChannelId) {
        const m = await bot.api.sendMessage(s.adminChannelId, text, {parse_mode: "MarkdownV2"})
        return m.message_id
    }
}
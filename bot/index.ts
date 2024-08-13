import {Bot, GrammyError, HttpError, InlineKeyboard, Keyboard} from "grammy";
import axios from "axios";
import dotenv from "dotenv"
dotenv.config();


const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");

const bot = new Bot(token); // <-- put your bot token between the ""


bot.on("message", async (ctx: any) => {
    await _checkStatus(ctx)
});



// Start the bot.
bot.start();













bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

const _checkStatus = async (ctx: any) => {
    if (ctx.from.is_bot) return

    console.log("hjeee")

    ctx.reply("heyyyyyyyyyy youuuuuuu")

    return
    const data = {
        id: ctx.from.id,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        username: ctx.from.username,
    }
    const {data: result} = await axios.post("https://classregbot.mentorader.ir/api/user", data)
    if (result.ok) {
        console.log(result.user, "###################################")
        if (!!result.user.licenseToken) {
            return await _showLicense(ctx)
        } else if (!!result.user.paid) {
            return await _generateLicense(ctx)
        } else if (!!result.user.phoneNumber) {
            return await showMiniApp(ctx)
        } else if (!!ctx.message.contact) {
            return await _registerComplete(ctx)
        } else {
            return await _sendNumberRequest(ctx)
        }
    }
}


const _generateLicense = async (ctx: any) => {
    const {data: result} = await axios.post("https://classregbot.mentorader.ir/api/license/" + ctx.from.id)

    if(!result.ok) {
        return await ctx.api.sendMessage(ctx.chat.id, "خطایی رخ داده است :(")
    }

    if(!result.user.licenseToken) {
        return await ctx.api.sendMessage(ctx.chat.id, "خطایی در تولید لایسنس رخ داد، مجدد تلاش کنید")
    }

    const text = "لایسنس شما در اسپات پلیر:\n" + "```" + result.user.licenseToken + "```" + "\n\n لایسنس را کپی کرده و در اسپات پلیر درج کنید"
    await ctx.api.sendMessage(ctx.chat.id, text, {parse_mode: "MarkdownV2"})
}


const _showLicense = async (ctx: any) => {
    const {data: result} = await axios.get("https://classregbot.mentorader.ir/api/user/" + ctx.from.id)
    const text = "لایسنس شما در اسپات پلیر:\n" + "```" + result.user.licenseToken + "```" + "\n\n لایسنس را کپی کرده و در اسپات پلیر درج کنید"
    await ctx.api.sendMessage(ctx.chat.id, text, {parse_mode: "MarkdownV2"})
}


const _showMiniApp = async (ctx: any) => {
    const text = "جهت ثبت نام در کلاس روی دکمه زیر کلیک کنید"
    const keyboard = new InlineKeyboard()
        .webApp("ثبت نام", "https://classregbot.mentorader.ir/")
    await ctx.api.sendMessage(ctx.chat.id, text, {parse_mode: "MarkdownV2", reply_markup: keyboard})
}

const _registerComplete = async (ctx: any) => {
    const data = {
        id: ctx.from.id,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        username: ctx.from.username,
        phone_number: ctx.message.contact.phone_number
    }
    const {data: result} = await axios.post("https://classregbot.mentorader.ir/api/user", data)

    // await ctx.api.editMessageReplyMarkup(ctx.chat.id, ctx.message.reply_to_message.message_id)
    const keyboard = new Keyboard()
        .text("ثبت نام")
        .resized()


    const text = "ثبت نام شما با موفقیت انجام شد"
    await ctx.api.sendMessage(ctx.chat.id, text, {reply_markup: keyboard})

    setTimeout(async () => {
        await checkStatus(ctx)
    }, 1000)
}


const _sendNumberRequest = async (ctx: any) => {
    const text = "برای استفاده از ربات، روی ارسال شماره موبایل بزنید و سپس Ok را بزنید:"
    const keyboard = new Keyboard()
        .requestContact("ارسال شماره موبایل")
        .resized()

    keyboard.one_time_keyboard = true

    await ctx.api.sendMessage(ctx.chat.id, text, {parse_mode: "MarkdownV2", reply_markup: keyboard})
}




import {Bot, GrammyError, HttpError, InlineKeyboard, Keyboard} from "grammy";
import * as dotenv from "dotenv"
import {axiosServer} from "../lib/axiosServer";

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


    const data = {
        id: ctx.from.id,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
    }
    const {data: result} = await axiosServer.post("user", data)

    if (!result.user.isActive) {
        return await userInactive(ctx)
    }
    if (!!result.user.phoneNumber) {
        return await showMainMenu(ctx)
    }
    if (!!ctx.message.contact) {
        return await savePhoneNumber(ctx)
    }
    if (!result.user.phoneNumber) {
        return await sendPhoneNumberRequest(ctx)
    }
}


const showMainMenu = async (ctx: any) => {
    const {data: resultUser} = await axiosServer.get(`user/${ctx.from.id}`)
    const {data: resultCourses} = await axiosServer.get("course")


    if (!resultCourses.courses?.length) {
        const text = "هنوز هیچ کلاسی پیدا نشد، مجددا بعدا تلاش کنید"
        const keyboard = new InlineKeyboard()

        if (resultUser.user.isAdmin) {
            keyboard.webApp("پنل مدیریت", `${process.env.NEXT_PUBLIC_BASE_URL}admin`).row()
        }
        return await ctx.api.sendMessage(ctx.chat.id, text, {parse_mode: "MarkdownV2", reply_markup: keyboard})
    } else {
        const text = "کلاس را انتخاب کنید:"
        const keyboard = new InlineKeyboard()

        for (let i = 0; i < resultCourses.courses.length; i++) {
            const c = resultCourses.courses[i]
            keyboard.webApp(c.title, `${process.env.NEXT_PUBLIC_BASE_URL}course/${c.id}`).row()
        }

        if (resultUser.user.isAdmin) {
            keyboard.webApp("پنل مدیریت", `${process.env.NEXT_PUBLIC_BASE_URL}admin`).row()
        }
        return await ctx.api.sendMessage(ctx.chat.id, text, {parse_mode: "MarkdownV2", reply_markup: keyboard})
    }


}

const savePhoneNumber = async (ctx: any) => {
    const data = {
        id: ctx.from.id,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
        phoneNumber: ctx.message.contact.phone_number
    }
    await axiosServer.post("user", data)

    const keyboard = new Keyboard()
        .text("منوی اصلی")
        .resized()

    const text = "ثبت نام شما با موفقیت انجام شد"
    await ctx.api.sendMessage(ctx.chat.id, text, {reply_markup: keyboard})

    setTimeout(async () => {
        await showMainMenu(ctx)
    }, 1000)
}


const sendPhoneNumberRequest = async (ctx: any) => {
    const text = "برای استفاده از ربات، روی ارسال شماره موبایل بزنید و سپس Share را بزنید:"
    const keyboard = new Keyboard()
        .requestContact("ارسال شماره موبایل")
        .resized()
    keyboard.one_time_keyboard = true
    await ctx.api.sendMessage(ctx.chat.id, text, {reply_markup: keyboard})
}


const userInactive = async (ctx: any) => {
    const text = "اکانت شما موقتا غیر فعال شده است"
    await ctx.api.sendMessage(ctx.chat.id, text)
}




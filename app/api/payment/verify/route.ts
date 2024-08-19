import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";
import {axiosServer} from "@/lib/axiosServer";
import axios from "axios";
import {sha512} from "js-sha512";
import {sendMessage2User, sendNotify2AdminChanel} from "@/lib/tlgbot";


// create payment
export async function POST(request: NextRequest) {
    const body = await request.json();

    const {
        status,
        orderId,
        refNumber,
        transactionId,
        cardNumber,
        trackingCode
    } = body

    if (!orderId) {
        return NextResponse.json({ok: false, error: "شناسه سفارش درج نشده است"}, {status: 404})
    }


    // @ts-ignore
    const payment = await prisma.Payment.findUnique(
        {
            where: {id: +orderId},
            include: {
                user: true,
                course: true,
            }
        }
    )

    if (!payment) {
        return NextResponse.json({ok: false, error: "سفارش پیدا نشد"}, {status: 404})
    }
    if (!payment.user) {
        return NextResponse.json({ok: false, error: "کاربر پیدا نشد"}, {status: 404})
    }
    if (!payment.user.isActive) {
        return NextResponse.json({ok: false, error: "کاربر غیرفعال می باشد"}, {status: 403})
    }
    if (!payment.course) {
        return NextResponse.json({ok: false, error: "کلاس پیدا نشد"}, {status: 404})
    }
    if (!payment.course.isActive) {
        return NextResponse.json({ok: false, error: "کلاس غیرفعال می باشد"}, {status: 403})
    }
    if (payment.success !== null) {
        return successPayment(payment.id)
    }
    if (payment.success === false) {
        return failurePayment(payment.id)
    }


    // @ts-ignore
    await prisma.Payment.update({
        where: {
            id: payment.id,
        },
        data: {
            refNumber: refNumber || null,
            trackingCode: trackingCode || null,
            transactionId: transactionId || null,
            cardNumber: cardNumber || null,
        },
    });


    if (+status !== 1) {
        console.log("###VERIFYPAYMENT", 1)
        // @ts-ignore
        await prisma.Payment.update({
            where: {
                id: payment.id,
            },
            data: {
                success: false,
            },
        });
        return await failurePayment(payment.id)
    }
    if (+status === 1) {
        try {
            const ref_num = payment.refNumber
            const amount = payment.amount
            const sign = sha512.hmac(process.env.PAYSTAR_GATEWAY_KEY!, `${amount}#${ref_num}#${cardNumber}#${trackingCode}`);
            const body = {
                ref_num,
                amount,
                sign,
            }
            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.PAYSTAR_GATEWAY_ID
            }
            const {data} = await axios.post(process.env.PAYSTAR_VERIFY_PAYMENT_BASE_URL!, body, {headers})
            if (+data.status === 1) {
                // @ts-ignore
                await prisma.Payment.update({
                    where: {
                        id: payment.id,
                    },
                    data: {
                        success: true,
                    },
                });
                return successPayment(payment.id)
            } else {
                console.log("###VERIFYPAYMENT", 2)
                // @ts-ignore
                await prisma.Payment.update({
                    where: {
                        id: payment.id,
                    },
                    data: {
                        success: false,
                    },
                });
                return await failurePayment(payment.id)
            }
        } catch (e) {
            console.log("###VERIFYPAYMENT", 3)
            // @ts-ignore
            await prisma.Payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    success: false,
                },
            });
            return await failurePayment(payment.id)
        }
    }
}


const successPayment = async (id: number) => {
    // @ts-ignore
    const p = await prisma.Payment.findUnique({
        where: {id: id},
        include: {
            user: true,
            course: true,
        }
    })

    let text = "✅ ثبت نام شما در *" + p.course.title + "* با موفقیت انجام شد"
    await sendMessage2User(p.userId, text)

    const adminMgId = await sendNotify2AdminChanel
(`
مبلغ *${p.amount}* ریال بابت ثبت نام در کلاس *${p.course.title}* دریافت شد

*کاربر:*
[${p.user.firstName + (p.user.lastName ? " " + p.user.lastName : "")}](tg://user?id=${p.user.id})

*مشخصات واریزی:*
CardNumber: \`${p.cardNumber}\`
RefNumber: \`${p.refNumber}\`
TrackingCode: \`${p.trackingCode}\`
TransactionId: \`${p.transactionId}\`
`)

    try {
        const body = {
            course: [p.course.uuid],
            name: `${p.user.firstName} ${p.user.lastName}`,
            watermark: {texts: [{text: "0" + p.user.phoneNumber?.substring(3) || "-"}]}
        }
        const headers = {
            "$API": process.env.SPOTPLAYER_LICENSE_API_KEY,
            "$LEVEL": -1
        }
        const {data} = await axios.post(process.env.SPOTPLAYER_LICENSE_BASE_URL!, body, {headers})
        const token = data.key

        const _data = {
            courseId: p.courseId,
            userId: p.userId,
            token
        }

        // @ts-ignore
        const license = await prisma.License.create(
            {data: _data}
        )

        let text = "*لایسنس شما:*"
        text += "\n"
        text += "```" + "License\n" + (license?.token || "-") + "```"
        await sendMessage2User(p.userId, text)


        await sendNotify2AdminChanel(`\`\`\`License:\n${license?.token || ""}\`\`\``)
    } catch (e) {

        let text = "متاسفانه خطایی در تولید لایسنس *" + p.course.title + "* رخ داد"
        text += "\n"
        text += "جهت دریافت لایسنس، با کارشناسان ما در ارتباط باشید"
        await sendMessage2User(p.userId, text, true)

        await sendNotify2AdminChanel(`❌ لایسنس تولید نشد ❌`)

        // @ts-ignore
        return NextResponse.json({
            ok: true,
            orderId: p.id,
            refNumber: p.refNumber,
            trackingCode: p.trackingCode,
            courseId: p.courseId,
            error: "خطایی در تولید لایسنس رخ داد. با کارشناسان ما در ارتباط باشید"
        })
    }

    return NextResponse.json({
        ok: true,
        orderId: p.id,
        refNumber: p.refNumber,
        trackingCode: p.trackingCode,
        courseId: p.courseId
    })
}


const failurePayment = async (id: number) => {
    // @ts-ignore
    const p = await prisma.Payment.findUnique({
        where: {id: id},
        include: {
            user: true,
            course: true,
        }
    })

    let text = "❌ ثبت نام شما در *" + p.course.title + "* با خطا مواجه شد"
    await sendMessage2User(p.userId, text, true)

    return NextResponse.json({ok: false, orderId: p.id, refNumber: p.refNumber})
}
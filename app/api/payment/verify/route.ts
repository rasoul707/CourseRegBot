import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";
import {axiosServer} from "@/lib/axiosServer";
import axios from "axios";
import {sha512} from "js-sha512";

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
    if (payment.success) {
        return successPayment(payment.id)
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


    if(status !== 1) {
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
    if(status === 1) {
        try {
            const ref_num = payment.refNumber
            const amount = payment.amount
            const sign = sha512.hmac(process.env.NEXT_PUBLIC_PAYSTAR_KEY || "", `${amount}#${ref_num}#${cardNumber}#${trackingCode}`);
            const body = {
                ref_num,
                amount,
                sign,
            }
            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.NEXT_PUBLIC_PAYSTAR_API
            }
            const {data} = await axios.post("https://core.paystar.ir/api/pardakht/verify", body, {headers})
            if (data.status === 1) {
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


    try {
        const body = {
            course: [p.course.uuid],
            name: `${p.user.firstName} ${p.user.lastName}`,
            watermark: {texts: [{text: "0" + p.user.phoneNumber?.substring(3) || "-"}]}
        }
        const headers = {
            "$API": "ZJQMGL3oMXoBBeu9tYrV6U+qiQJO9w==",
            "$LEVEL": -1
        }
        const {data} = await axios.post("https://panel.spotplayer.ir/license/edit/", body, {headers})
        const token = data.key

        const _data = {
            courseId: p.courseId,
            userId: p.userId,
            token
        }

        // @ts-ignore
        await prisma.License.create(
            {data: _data}
        )

    } catch (e) {
        // @ts-ignore
        return NextResponse.json({ok: true, orderId: p.id, refNumber: p.refNumber, trackingCode: p.trackingCode, courseId: p.courseId, error: "خطایی در تولید لایسنس رخ داد. با مدیریت هماهنگ کنید."})
    }

    return NextResponse.json({ok: true, orderId: p.id, refNumber: p.refNumber, trackingCode: p.trackingCode, courseId: p.courseId})
}



const failurePayment = async(id: number) => {
    // @ts-ignore
    const p = await prisma.Payment.findUnique({
        where: {id: id}
    })
    return NextResponse.json({ok: false, orderId: p.id, refNumber: p.refNumber})
}
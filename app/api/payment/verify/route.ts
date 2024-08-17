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
        return NextResponse.json({ok: false, error: "تراکنش ناموفق بود"}, {status: 400})
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
                return NextResponse.json({ok: false, error: "پرداخت ناموفق بود"}, {status: 400})
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
            return NextResponse.json({ok: false, error: "پاسخی از درگاه دریافت نشد"}, {status: 401})
        }
    }
}





const successPayment = (id: number) => {
    // @ts-ignore
    const p = await prisma.Payment.findUnique({
        where: {id: id}
    })
    // @@@@@@@@
    // TODO::generate license if not generated before
    // @@@@@@@@
    return NextResponse.json({ok: true, refNumber: p.refNumber, trackingCode: p.trackingCode})
}
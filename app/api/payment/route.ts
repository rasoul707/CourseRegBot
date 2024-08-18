import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";
import {axiosServer} from "@/lib/axiosServer";
import axios from "axios";
import {sha512} from "js-sha512";

// create payment
export async function POST(request: NextRequest) {
    const body = await request.json();

    const {
        userId,
        courseId,
        paymentType
    } = body

    if (!userId) {
        return NextResponse.json({ok: false, error: "شناسه کاربر درج نشده است"}, {status: 400})
    }

    if (!courseId) {
        return NextResponse.json({ok: false, error: "شناسه کلاس درج نشده است"}, {status: 400})
    }


    // @ts-ignore
    const user = await prisma.User.findUnique(
        {
            where: {id: +userId},
        }
    )
    // @ts-ignore
    const course = await prisma.Course.findUnique(
        {
            where: {id: +courseId},
        }
    )

    if (!user) {
        return NextResponse.json({ok: false, error: "کاربر پیدا نشد"}, {status: 404})
    }
    if (!user.isActive) {
        return NextResponse.json({ok: false, error: "اکانت شما غیرفعال می باشد"}, {status: 403})
    }
    if (!user.phoneNumber) {
        return NextResponse.json({ok: false, error: "شماره موبایل خود را ثبت نکرده اید"}, {status: 403})
    }
    if (!course) {
        return NextResponse.json({ok: false, error: "کلاس پیدا نشد"}, {status: 404})
    }
    if (!course.isActive) {
        return NextResponse.json({ok: false, error: "کلاس غیر فعال می باشد"}, {status: 403})
    }


    // @ts-ignore
    const license = await prisma.Licesnse.findFirst(
        {
            where: {
                courseId: +courseId,
                userId: +userId
            },
        }
    )

    if (!!license) {
        return NextResponse.json({ok: false, error: "شما قبلا در این کلاس ثبت نام کرده اید"}, {status: 401})
    }


    const _data = {
        courseId: +courseId,
        userId: +userId,
        amount: +course.price,
    }


    // @ts-ignore
    const payment = await prisma.Payment.create({
        data: _data,
    });


    try {
        const amount = payment.amount
        const order_id = payment.id
        const callback = process.env.PAYSTAR_CALLBACK_BASE_URL + "payment"
        const sign = sha512.hmac(process.env.PAYSTAR_GATEWAY_KEY!, `${amount}#${order_id}#${callback}`);
        const callback_method = 1
        const body = {
            amount,
            order_id,
            callback,
            sign,
            callback_method
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.PAYSTAR_GATEWAY_ID
        }
        const {data} = await axios.post(process.env.PAYSTAR_CREATE_PAYMENT_BASE_URL!, body, {headers})
        if (+data.status === 1) {
            // @ts-ignore
            await prisma.Payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    refNumber: data.data.ref_num
                },
            });
            return NextResponse.json({ok: true, url: `${process.env.PAYSTAR_GATEWAY_PAYMENT_BASE_URL!}?token=${data.data.token}`})
        }
        return NextResponse.json({ok: false, error: "پاسخ مناسبی از درگاه دریافت نشد"}, {status: 401})
    } catch (e) {
        console.log("###Payment", e)
        return NextResponse.json({ok: false, error: "پاسخی از درگاه دریافت نشد"}, {status: 401})
    }
}

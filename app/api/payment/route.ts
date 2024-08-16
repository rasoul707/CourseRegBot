import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";
import {axiosServer} from "@/lib/axiosServer";
import axios from "axios";

// create payment
export async function POST(request: NextRequest) {
    const body = await request.json();

    const {
        userId,
        courseId,
        paymentType
    } = body


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

    if(!user) {
        return NextResponse.json({ok: false, error: "کاربر پیدا نشد"}, {status: 404})
    }
    if(!user.isActive) {
        return NextResponse.json({ok: false, error: "اکانت شما غیرفعال می باشد"}, {status: 403})
    }
    if(!user.phoneNumber) {
        return NextResponse.json({ok: false, error: "شماره موبایل خود را ثبت نکرده اید"}, {status: 403})
    }
    if(!course) {
        return NextResponse.json({ok: false, error: "کلاس پیدا نشد"}, {status: 404})
    }
    if(!course.isActive) {
        return NextResponse.json({ok: false, error: "کلاس غیر فعال می باشد"}, {status: 403})
    }


    // @ts-ignore
    const license = await prisma.Licesnse.findUnique(
        {
            where: {
                courseId: +courseId,
                userId: +userId
            },
        }
    )

    if(!license) {
        return NextResponse.json({ok: false, error: "شما قبلا در این کلاس ثبت نام کرده اید"}, {status: 401})
    }


    const _data = {
        courseId: +courseId,
        userId: +userId,
        price: course.price,
    }


    // @ts-ignore
    const payment = await prisma.Payment.create({
        data: _data,
    });


    try {
        const body = {
            amount: payment.price,
            order_id: payment.id,
            callback: process.env.NEXT_PUBLIC_BASE_URL + "payment",
            sign: ""
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.NEXT_PUBLIC_PAYSTAR_API
        }
        const _paymentResponse = await axios.post("https://core.paystar.ir/api/pardakht/create", body, {headers})
    } catch (e) {

    }


    const result = {}

    return NextResponse.json(result);
}


// get courses list
export async function GET(request: NextRequest) {

    // @ts-ignore
    const courses = await prisma.Course.findMany()

    return NextResponse.json({courses})
}
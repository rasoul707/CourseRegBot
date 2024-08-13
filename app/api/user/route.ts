import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";

// create user
export async function POST(request: NextRequest) {
    const body = await request.json();

    if(!!body.phoneNumber) {
        body.phoneNumber = !!body.phoneNumber ? (!body.phoneNumber.includes("+") ? ("+" + body.phoneNumber) : body.phoneNumber) : null
    }

    // @ts-ignore
    const user = await prisma.User.upsert({
        where: {id: +body.id},
        create: {
            ...body,
            id: +body.id,
        },
        update: {
            ...body,
        },
    });

    return NextResponse.json({user});
}


// get users list
export async function GET(request: NextRequest) {
    // @ts-ignore
    const users = await prisma.User.findMany()

    return NextResponse.json({users})
}
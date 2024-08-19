import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";

// update setting
export async function PATCH(request: NextRequest) {
    const body = await request.json();

    // @ts-ignore
    const setting = await prisma.Setting.update({
        where: {
           id: 1
        },
        data: {
            ...body
        },
    });

    return NextResponse.json({setting});
}


// get setting
export async function GET(request: NextRequest) {

    // @ts-ignore
    const setting = await prisma.Setting.findUnique({
        where: {
            id: 1
        },
    })

    return NextResponse.json({setting})
}
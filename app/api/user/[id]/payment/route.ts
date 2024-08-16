import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";



// get courses list of user
export async function GET(request: NextRequest, {params}: { params: { id: string } }) {

    const userId = params.id

    // @ts-ignore
    const courses = await prisma.Payment.findMany({
        where: {
            userId: +userId
        }
    })

    return NextResponse.json({courses})
}
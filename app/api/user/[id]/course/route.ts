import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";



// get courses list of user
export async function GET(request: NextRequest, {params}: { params: { id: string } }) {

    const userId = params.id

    // @ts-ignore
    const list = await prisma.License.findMany({
        where: {
            userId: +userId
        },
        include: {
            course: true
        }
    })

    return NextResponse.json({list})
}
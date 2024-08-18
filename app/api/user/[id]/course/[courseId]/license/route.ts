import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";



// get license of course
export async function GET(request: NextRequest, {params}: { params: { id: string, courseId: string } }) {

    const userId = params.id
    const courseId = params.courseId

    // @ts-ignore
    const license = await prisma.Licesnse.findFirst({
        where: {
            userId: +userId,
            courseId: +courseId
        }
    })

    return NextResponse.json({license})
}
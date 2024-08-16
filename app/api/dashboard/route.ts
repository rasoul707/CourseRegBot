import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";



// get dashboard detail
export async function GET(request: NextRequest) {
    // @ts-ignore
    const courseCount = await prisma.Course.count()
    // @ts-ignore
    const userCount = await prisma.User.count()
    return NextResponse.json({courseCount, userCount})
}
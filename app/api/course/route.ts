import {NextRequest, NextResponse} from "next/server";

import prisma from "@/lib/prisma";

// create course
export async function POST(request: NextRequest) {
    const body = await request.json();

    // @ts-ignore
    const course = await prisma.Course.create({
        data: {
            ...body
        },
    });

    return NextResponse.json({course});
}


// get courses list
export async function GET(request: NextRequest) {

    // @ts-ignore
    const courses = await prisma.Course.findMany()

    return NextResponse.json({courses})
}
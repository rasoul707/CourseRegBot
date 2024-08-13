import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";


// get a course
export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    const {id} = params

    // @ts-ignore
    const course = await prisma.Course.findUnique(
        {
            where: {id: +id},
        }
    )

    return NextResponse.json({course})
}


// update a course
export async function PATCH(request: NextRequest, {params}: { params: { id: string } }) {
    const {id} = params
    const body = await request.json();

    // @ts-ignore
    const course = await prisma.Course.update({
        where: {id: +id},
        data: {
            ...body,
        },
    });

    return NextResponse.json({course});
}
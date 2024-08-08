import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const {id} = params
    // @ts-ignore
    let user = await prisma.User.findUnique(
        {
            where: {
                id: parseInt(id),
            },
        }
    )
    // @ts-ignore
    return Response.json({ok: true, user})
}
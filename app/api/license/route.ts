import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const body = await request.json()
    const {id} = body
    // @ts-ignore
    let user = await prisma.User.findUnique(
        {
            where: {
                id,
            },
        }
    )
    if(!user) {
        // @ts-ignore
        return Response.json({ok: false, error: "USER_NOT_FOUND"})
    }
    if(!user.paid) {
        // @ts-ignore
        return Response.json({ok: false, error: "NOT_PAID"})
    }
    if(!user.licenseToken) {
        const token = "112233445566778899"
        // @ts-ignore
        user = await prisma.User.update(
            {
                where: {
                    id: id,
                },
                data: {
                    licenseToken: token
                },
            }
        )
    }

    // @ts-ignore
    return Response.json({ok: true, user})
}
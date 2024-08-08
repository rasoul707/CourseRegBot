import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const body = await request.json()
    const {id, first_name, last_name, username, phone_number} = body
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
        user = await prisma.User.create(
            {
                data: {
                    id: id,
                    firstName: first_name || null,
                    lastName: last_name || null,
                    username: username || null,
                    phoneNumber: phone_number || null,
                    licenseToken: null,
                },
            }
        )
    }
    // @ts-ignore
    return Response.json({ok: true, user})
}
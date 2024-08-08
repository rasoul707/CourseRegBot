import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";


export async function POST(request: NextRequest, {params}: { params: { id: number } }) {
    const {id} = params
    // @ts-ignore
    let user = await prisma.User.findUnique(
        {
            where: {
                id: +id,
            },
        }
    )
    if (!user) {
        // @ts-ignore
        return Response.json({ok: false, error: "USER_NOT_FOUND"})
    }
    if (!user.paid) {
        // @ts-ignore
        return Response.json({ok: false, error: "NOT_PAID"})
    }
    if (!user.licenseToken) {
        try {
            const dd = {
                course: ["66b475cc00ec4c8a9a1b21f2"],
                name: `${user.firstName} ${user.lastName}`,
                watermark: {texts: [{text: "0" + user.phoneNumber?.substring(3) || "-"}]}
            }
            const {data} = await axios.post("https://panel.spotplayer.ir/license/edit/", dd)
            const token = data.key
            // @ts-ignore
            user = await prisma.User.update(
                {
                    where: {
                        id: +id,
                    },
                    data: {
                        licenseToken: token
                    },
                }
            )
        } catch (e) {
            // @ts-ignore
            return Response.json({ok: false, user})
        }
    }

    // @ts-ignore
    return Response.json({ok: true, user})
}
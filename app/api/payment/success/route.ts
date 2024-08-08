import {NextRequest, NextResponse} from "next/server";


export async function POST(request: NextRequest) {
    const body = await request.json()
    // const res = await fetch('https://data.mongodb-api.com/...', {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'API-Key': process.env.DATA_API_KEY,
    //     },
    // })
    // const data = await res.json()
    // @ts-ignore
    return Response.json({ ok: true })
}
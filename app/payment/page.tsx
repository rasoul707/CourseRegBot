"use client"

import React, {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Spinner} from "@nextui-org/spinner";
import {axiosNoAuth} from "@/lib/axios";


export default function Page() {

    const searchParams = useSearchParams()

    const status = searchParams.get("status")
    const orderId = searchParams.get("order_id")
    const refNumber = searchParams.get("ref_num")
    const transactionId = searchParams.get("transaction_id")
    const cardNumber = searchParams.get("card_number")
    const trackingCode = searchParams.get("tracking_code")

    useEffect(() => {
        initializing()
    }, []);

    const initializing = async () => {
        // @ts-ignore
        if (window?.Telegram?.WebApp) {
            // @ts-ignore
            window.Telegram.WebApp.expand()
            await auth()
            await verifyPayment()
        }
        setLoading(false)
    }

    const auth = async () => {
        // @ts-ignore
        const ut = window.Telegram?.WebApp.initDataUnsafe
        const user = ut.user
        return new Promise(async (resolve, reject) => {
            try {
                const _data = {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    username: user.username,
                }
                const {data} = await axiosNoAuth.post(`/user`, _data)
                setUser(data.user)
                resolve(data.user)
            } catch (e) {
                setUser(null)
                resolve(false)
            }
        })
    }

    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const verifyPayment = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const _data = {
                    status,
                    orderId,
                    refNumber,
                    transactionId,
                    cardNumber,
                    trackingCode,
                }
                const {data} = await axiosNoAuth.post(`/payment/verify`, _data)
                setResult(data)
                resolve(data)
            } catch (e) {
                setResult(null)
                setError(e)
                resolve(false)
            }
        })
    }


    const [user, setUser] = useState<any>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    if (isLoading) {
        return (
            <div className="h-full flex justify-center items-center">
                <Spinner size="lg"/>
            </div>
        )
    }
    if (!user) {
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-lg text-red-600 font-bold">
                    احراز هویت موفقیت آمیز نبود :/
                </span>
            </div>
        )
    }

    if ((!result && error) || (result && !error)) {
        return (
            <div className="h-full flex flex-col text-red-600 justify-center items-center gap-2">
                <span className="text-2xl font-bold py-8">
                    پرداخت ناموفق
                </span>
                {!!error && (
                    <span className="text-sm font-light flex flex-col gap-2">
                        <div className="flex gap-2">
                            <b>خطا:</b>
                            <span>{JSON.stringify(error)}</span>
                        </div>
                    </span>
                )}
                {!!result && (
                    <span className="text-sm font-light flex flex-col gap-2">
                        <div className="flex gap-2">
                            <b>شماره سفارش:</b>
                            <span>{result.orderId}</span>
                        </div>
                        <div className="flex gap-2">
                            <b>شماره رهگیری:</b>
                            <span>{result.refNumber}</span>
                        </div>
                    </span>
                )}
            </div>
        )
    }


    return (
        <div className="h-full flex flex-col text-success-600 justify-center items-center gap-2">
            <span className="text-2xl font-bold py-8">
                پرداخت موفق
            </span>
            <span className="text-sm font-light flex flex-col justify-center items-center gap-2">
                <div className="flex gap-2">
                    <b>شماره سفارش:</b>
                    <span>{result?.orderId || "-"}</span>
                </div>
                <div className="flex gap-2">
                    <b>شماره رهگیری:</b>
                    <span>{result?.refNumber || "-"}</span>
                </div>
                <div className="flex gap-2">
                    <b>کد رهگیری بانکی:</b>
                    <span>{result?.trackingCode || "-"}</span>
                </div>
            </span>
        </div>
    )
}




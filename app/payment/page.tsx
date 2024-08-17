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
    const verifyPayment = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const _data = {
                    status,
                    orderId,
                    refNumber,
                    transactionId,
                    cardNumber,
                    trackingCode
                }
                const {data} = await axiosNoAuth.post(`/payment/verify`, _data)
                setResult(data)
                resolve(data)
            } catch (e) {
                setUser(null)
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

    return (
        <div className="flex flex-col h-full justify-between p-2  overflow-hidden">
            <div
                className="font-black text-blue-900 h-full text-lg text-center items-center justify-center flex flex-col gap-4"
            >
                <span>ربات ثبت نام سریع کلاس</span>
            </div>
        </div>
    )
}




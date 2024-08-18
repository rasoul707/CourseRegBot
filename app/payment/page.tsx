"use client"

import React, {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Spinner} from "@nextui-org/spinner";
import {axiosNoAuth} from "@/lib/axios";
import {Button} from "@nextui-org/button";
import {toast} from "@/lib/toast";


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
            // @ts-ignore
            window.Telegram.WebApp.enableClosingConfirmation()
            await verifyPayment()
        }
        setLoading(false)
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

    const onBack2Bot = () => {
        // @ts-ignore
        if (window?.Telegram?.WebApp) {
            // @ts-ignore
            window.Telegram.WebApp.close()
        } else {
            toast.info("لطفا مینی اپ را ببندید")
        }
    }
    const go2Course = () => {
        const courseId = result.courseId
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}course/${courseId}`
    }

    const [isLoading, setLoading] = useState<boolean>(true)
    if (isLoading) {
        return (
            <div className="h-full flex justify-center items-center">
                <Spinner size="lg"/>
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
                    <span className="text-sm font-light flex flex-col justify-center items-center gap-2">
                        <div className="flex gap-2">
                            <b>خطا:</b>
                            <span dir="ltr">{error.error}</span>
                        </div>
                        <span>
                            در صورت کسر از حساب، مبلغ تا حداکثر 72 ساعت به حسابتان برگردانده می شود.
                        </span>
                        <Button
                            className="my-5"
                            color="default"
                            variant="shadow"
                            size="lg"
                            onPress={onBack2Bot}
                        >
                            بازگشت به ربات
                        </Button>
                    </span>
                )}
                {!!result && (
                    <span className="text-sm font-light flex flex-col justify-center items-center gap-2">
                        <div className="flex gap-2">
                            <b>شماره سفارش:</b>
                            <span dir="ltr">{result.orderId}</span>
                        </div>
                        <div className="flex gap-2">
                            <b>شماره رهگیری:</b>
                            <span dir="ltr">{result.refNumber}</span>
                        </div>
                        <span>
                            در صورت کسر از حساب، مبلغ تا حداکثر 72 ساعت به حسابتان برگردانده می شود.
                        </span>
                        <Button
                            className="my-5"
                            color="default"
                            variant="shadow"
                            size="lg"
                            onPress={onBack2Bot}
                        >
                            بازگشت به ربات
                        </Button>
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
                    <span dir="ltr">{result?.orderId || "-"}</span>
                </div>
                <div className="flex gap-2">
                    <b>شماره رهگیری:</b>
                    <span dir="ltr">{result?.refNumber || "-"}</span>
                </div>
                <div className="flex gap-2">
                    <b>کد رهگیری بانکی:</b>
                    <span dir="ltr">{result?.trackingCode || "-"}</span>
                </div>
                {result.error && (
                    <>
                        <span className="text-sm font-bold text-red-600">{result?.error}</span>
                        <Button
                            className="my-5"
                            color="default"
                            variant="shadow"
                            size="lg"
                            onPress={onBack2Bot}
                        >
                            بازگشت به ربات
                        </Button>
                    </>
                )}
                {!result.error && (
                    <Button
                        className="my-5"
                        color="primary"
                        variant="shadow"
                        size="lg"
                        onPress={go2Course}
                    >
                        دریافت اطلاعات کلاس
                    </Button>
                )}
            </span>
        </div>
    )
}




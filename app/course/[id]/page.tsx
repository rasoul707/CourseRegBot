"use client"

import {Radio, RadioGroup} from "@nextui-org/radio";
import React, {useEffect, useState} from "react";
import {axiosNoAuth} from "@/lib/axios";
import {Button} from "@nextui-org/button";
import {Spinner} from "@nextui-org/spinner";
import {Image} from "@nextui-org/image";
import {toast} from "@/lib/toast";


export default function Page({params}: { params: { id: string } }) {

    const courseId = params.id

    useEffect(() => {
        initializing()
    }, []);

    const initializing = async () => {
        // @ts-ignore
        if (window?.Telegram?.WebApp) {
            // @ts-ignore
            window.Telegram.WebApp.expand()
            await getUser()
            await getCourse()
        }



        setLoading(false)
    }

    const getUser = async () => {
        // @ts-ignore
        console.log({i: window.Telegram?.WebApp.initData, n: window.Telegram?.WebApp.initDataUnsafe})
        // @ts-ignore
        // console.log("@@@@@@@@@@", window.Telegram?.WebApp.initData)
        // @ts-ignore
        // console.log("$$$$$$$$$$", window.Telegram?.WebApp.initDataUnsafe)
        // const user = await axiosNoAuth.get(`/user/${}`)
        // console.log(user, "user")
    }

    const [isLoading, setLoading] = useState<boolean>(true)
    const [course, setCourse] = useState<any>(null)
    const [user, setUser] = useState<any>(null)

    const getCourse = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const {data} = await axiosNoAuth.get(`/course/${courseId}`)
                setCourse(data.course)
                resolve(data.course)
            } catch (e) {
                reject()
            }
        })
    }

    const [paymentType, setPaymentType] = useState<"irr" | "usdt">("irr")
    const [isPaymentLoading, setPaymentLoading] = useState<boolean>(false)
    const onStartPayment = async () => {
        setPaymentLoading(true)
        try {
            const {data} = await axiosNoAuth.get(`/payment/${course.id}`)
            toast.success("در حال انتقال به درگاه پرداخت ...")
        } catch (e) {
            toast.error(JSON.stringify(e))
            setPaymentLoading(false)
        }
    }

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
    if (!user.isActive) {
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-lg text-red-600 font-bold">
                    شما مجاز به ثبت نام نیستید :/
                </span>
            </div>
        )
    }
    if (!course) {
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-lg text-red-600 font-bold">
                    کلاس مورد نظر پیدا نشد :/
                </span>
            </div>
        )
    }
    if (!course?.isActive) {
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-lg text-red-600 font-bold">
                    کلاس مورد نظر غیر فعال شده است :/
                </span>
            </div>
        )
    }
    return (
        <div className="flex flex-col h-full justify-between p-2 overflow-hidden">
            <div className="flex flex-col gap-5">
                <div
                    className="font-black text-blue-900 text-lg text-center items-center justify-center flex flex-col gap-4"
                >
                    <Image
                        src={course.image}
                        height={120}
                        width={120}
                    />
                    <span>{course.title}</span>
                </div>
                <RadioGroup
                    label="روش پرداخت را انتخاب کنید:"
                    color="primary"
                    size="lg"
                    value={paymentType}
                    onChange={(e) => {
                        setPaymentType(e.target.value as "irr" | "usdt")
                    }}
                    isDisabled={isPaymentLoading}
                >
                    <Radio
                        value="irr"
                        description={course.price.toLocaleString() + " ریالء"}
                        classNames={{labelWrapper: "gap-2",}}
                    >
                        <span className="font-bold text-base">پرداخت ریالی</span>
                    </Radio>
                    <Radio
                        value="usdt"
                        description="به زودی..."
                        classNames={{labelWrapper: "gap-2",}}
                        isDisabled
                    >
                        <span className="font-bold text-base">پرداخت تتری</span>
                    </Radio>
                </RadioGroup>
            </div>
            <Button
                fullWidth
                size="lg"
                color="primary"
                onPress={onStartPayment}
                isLoading={isPaymentLoading}
            >
                پرداخت
            </Button>
        </div>
    )
}




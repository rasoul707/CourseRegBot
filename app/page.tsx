"use client"

import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Radio, RadioGroup} from "@nextui-org/radio";
import React, {useEffect} from "react";
import {axiosNoAuth} from "@/lib/axios";
import {Button} from "@nextui-org/button";


export default function Page() {

    useEffect(() => {
        // @ts-ignore
        if (window?.Telegram?.WebApp) {
            console.log("##################")
            getAuth()
            getCourse()
            // @ts-ignore
            window.Telegram.WebApp.expand()
        }
    }, []);

    const getAuth = async () => {
        // @ts-ignore
        console.log("@@@@@@@@@@", window.Telegram?.WebApp.initData)
        // @ts-ignore
        console.log("$$$$$$$$$$", window.Telegram?.WebApp.initDataUnsafe)
        const user = await axiosNoAuth.get("/user")
        console.log(user, "user")
    }

    const getCourse = async () => {
        const course = await axiosNoAuth.get("/course")
        console.log(course, "course")
    }

    return (
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <Card fullWidth className="">
                    <CardHeader
                        className="font-black text-blue-900 text-lg text-center items-center justify-center flex flex-col gap-2">
                        <img alt="logo" className="h-28 py-4" src="/logo.png"/>
                        <span>ثبت نام کلاس آنلاین گلدن تریدر</span>
                    </CardHeader>
                    <CardBody className="text-start">
                        <RadioGroup
                            label="روش پرداخت را انتخاب کنید:"
                            color="primary"
                            size="lg"
                            value="irr"
                        >
                            <Radio
                                value="irr"
                                description="7,800,000 تومانء"
                                classNames={{labelWrapper: "gap-2",}}
                            >
                                <span className="font-bold text-base">پرداخت ریالی</span>
                            </Radio>
                            <Radio
                                value="usdt"
                                description="130 تتر"
                                classNames={{labelWrapper: "gap-2",}}
                                isDisabled
                            >
                                <span className="font-bold text-base">پرداخت تتری</span>
                            </Radio>
                        </RadioGroup>
                    </CardBody>
                </Card>
            </section>
            <footer className="w-full flex items-center justify-center p-3">
                <Button
                    fullWidth
                    size="lg"
                    color="primary"
                >
                    پرداخت
                </Button>
            </footer>
        </main>
    )
}




"use client"

import {Radio, RadioGroup} from "@nextui-org/radio";
import React, {useEffect, useState} from "react";
import {axiosNoAuth} from "@/lib/axios";
import {Button} from "@nextui-org/button";
import {Spinner} from "@nextui-org/spinner";
import {Image} from "@nextui-org/image";
import {toast} from "@/lib/toast";
import {Snippet} from "@nextui-org/snippet";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {useRouter} from "next/navigation";


export default function Page({params}: { params: { id: string } }) {

    const courseId = params.id

    const router = useRouter()

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
            await auth()
        }
    }

    const [isLoading, setLoading] = useState<boolean>(true)
    const [course, setCourse] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [license, setLicense] = useState<any>(null)
    const [setting, setSetting] = useState<any>(null)


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


    const getCourse = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const {data} = await axiosNoAuth.get(`/course/${courseId}`)
                setCourse(data.course)
                resolve(data.course)
            } catch (e) {
                setCourse(null)
                resolve(false)
            }
        })
    }

    const getLicense = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const {data} = await axiosNoAuth.get(`/user/${user.id}/course/${course.id}/license`)
                setLicense(data.license)
                resolve(data.license)
            } catch (e) {
                console.error(e)
                setLicense(null)
                resolve(false)
            }
        })
    }



    const getSetting = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const {data} = await axiosNoAuth.get(`setting`)
                setSetting(data.setting)
                setLoading(false)
            } catch (e) {
                console.error(e)
                setSetting(null)
                setLoading(false)
                resolve(false)
            }
        })
    }


    useEffect(() => {
        if (!!user) getCourse()
    }, [user]);


    useEffect(() => {
        if (!!course) getLicense()
        getSetting()
    }, [course]);


    const [paymentType, setPaymentType] = useState<"irr" | "usdt">("irr")
    const [isPaymentLoading, setPaymentLoading] = useState<boolean>(false)

    const prePaymentModal = useDisclosure({defaultOpen: false});

    const prePayment = () => {
        if(paymentType === "irr") prePaymentModal.onOpen()
        if(paymentType === "usdt") {
            toast.info("در حال اتصال به پشتیبانی جهت واریز تتری ...")
            setTimeout(() => {
                // @ts-ignore
                if(window?.Telegram?.WebApp && !!setting) {
                    const username = setting?.supportUsername
                    const text = setting?.usdtPaymentMessage
                    // @ts-ignore
                    window?.Telegram?.WebApp?.openTelegramLink(`https://t.me/${username}?text=${text}`)
                }
                else {
                    router.push("https://spotplayer.ir/#download")
                }
            }, 2000)
        }
    }



    const onStartPayment = async () => {
        setPaymentLoading(true)
        try {
            const _data = {
                userId: user.id,
                courseId: course.id,
                paymentType
            }
            const {data} = await axiosNoAuth.post(`/payment`, _data)
            if (data.ok) {
                toast.success("در حال انتقال به درگاه پرداخت ...")
                setTimeout(() => {
                    window.location.href = data.url
                }, 1000)
            }
        } catch (e) {
            // @ts-ignore
            // toast.error()
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
    if (!user?.isActive) {
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-lg text-red-600 font-bold">
                    شما مجاز به ثبت نام نیستید :/
                </span>
            </div>
        )
    }
    if (!user?.phoneNumber) {
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-lg text-red-600 font-bold">
                    شماره موبایل خود را ثبت نکرده اید :/
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
        <div className="flex flex-col h-full justify-between p-2 overflow-x-hidden">
            <div className="flex flex-col gap-5">
                <div className="flex gap-2 bg-gray-200 p-4 rounded-xl">
                    <span className="font-bold">
                        کاربر:
                    </span>
                    <span>
                        {user.firstName + " " + user.lastName}
                    </span>
                </div>
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
                {!!license && (
                    <div className="flex flex-col items-start gap-2">
                        <span className="font-bold text-lg">لایسنس شما:</span>
                        <Snippet
                            variant="bordered"
                            color="primary"
                            fullWidth
                            symbol=""
                            classNames={{
                                pre: "w-[calc(100%-40px)]"
                            }}
                        >
                            <span className="text-gray-500 text-base w-full select-all overflow-hidden block">
                                {license.token}
                            </span>
                        </Snippet>
                        <span className="font-light text-sm">
                            لایسنس را کپی کرده و در اپلیکیشن پیست کنید.
                        </span>
                        <Button
                            fullWidth
                            size="lg"
                            color="secondary"
                            onPress={() => {
                                // @ts-ignore
                                if(window?.Telegram?.WebApp && course.tlgrmChannelLink) {
                                    // @ts-ignore
                                    window?.Telegram?.WebApp?.openTelegramLink(course.tlgrmChannelLink)
                                }
                                else {
                                    router.push(course.tlgrmChannelLink)
                                }
                            }}
                        >
                            دانلود اپلیکیشن
                        </Button>
                        <Button
                            fullWidth
                            size="lg"
                            color="primary"
                            onPress={() => {
                                // @ts-ignore
                                if(window?.Telegram?.WebApp) {
                                    // @ts-ignore
                                    window?.Telegram?.WebApp?.openLink("https://t.me", {try_instant_view: true})
                                }
                                else {
                                    router.push("https://spotplayer.ir/#download")
                                }
                            }}
                        >
                            دانلود اپلیکیشن
                        </Button>
                    </div>
                )}
                {!license && (
                    <>
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
                            >
                                <span className="font-bold text-base">پرداخت تتری</span>
                            </Radio>
                        </RadioGroup>
                    </>
                )}
            </div>
            {!license && (
                <>
                    <Button
                        fullWidth
                        size="lg"
                        color="primary"
                        onPress={prePayment}
                    >
                        پرداخت
                    </Button>
                    <Modal
                        backdrop="blur"
                        isOpen={prePaymentModal.isOpen}
                        onClose={prePaymentModal.onClose}
                        placement="bottom-center"
                        scrollBehavior="inside"
                        isDismissable
                    >
                        <ModalContent>
                            <ModalHeader>پرداخت</ModalHeader>
                            <ModalBody>
                                لطفا قبل از ادامه پرداخت فیلترشکن خود را خاموش کنید و سپس بر روی پرداخت کلیک کنید
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="shadow"
                                    color="primary"
                                    onPress={onStartPayment}
                                    isLoading={isPaymentLoading}
                                >
                                    پرداخت
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </div>
    )
}




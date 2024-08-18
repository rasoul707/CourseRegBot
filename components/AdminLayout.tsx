"use client"

import React, {useEffect, useState} from "react";

import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import {Link} from "@nextui-org/link";
import {usePathname} from "next/navigation";
import {axiosNoAuth} from "@/lib/axios";
import {Spinner} from "@nextui-org/spinner";


export default function AdminLayout({children}: { children: React.ReactNode; }) {

    const pathname = usePathname()

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

    const [isLoading, setLoading] = useState<boolean>(true)
    const [user, setUser] = useState<any>(null)


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
    if (!user?.isAdmin) {
        return (
            <div className="h-full flex justify-center items-center">
                <span className="text-lg text-red-600 font-bold">
                    شما دسترسی به این صفحه ندارید :/
                </span>
            </div>
        )
    }
    return (
        <main className="container mx-auto max-w-7xl flex-grow overflow-x-hidden">
            <section className="flex flex-col justify-center">
                <Navbar
                    classNames={{
                        item: [
                            "flex",
                            "relative",
                            "h-full",
                            "items-center",
                            "justify-center",
                            "w-24",
                            "data-[active=true]:text-foreground",
                            "data-[active=true]:after:content-['']",
                            "data-[active=true]:after:absolute",
                            "data-[active=true]:after:bottom-0",
                            "data-[active=true]:after:left-0",
                            "data-[active=true]:after:right-0",
                            "data-[active=true]:after:h-[2px]",
                            "data-[active=true]:after:rounded-[2px]",
                            "data-[active=true]:after:bg-primary",
                        ],
                    }}
                >
                    <NavbarContent className="flex gap-6 w-full" justify="center">
                        <NavbarItem isActive={pathname === "/admin"}>
                            <Link color={pathname === "/admin" ? "primary" : "foreground"} href="/admin">
                                داشبورد
                            </Link>
                        </NavbarItem>
                        <NavbarItem isActive={pathname === "/admin/course"}>
                            <Link color={pathname === "/admin/course" ? "primary" : "foreground"} href="/admin/course">
                                کلاس ها
                            </Link>
                        </NavbarItem>
                        <NavbarItem isActive={pathname === "/admin/user"}>
                            <Link color={pathname === "/admin/user" ? "primary" : "foreground"} href="/admin/user">
                                کاربران
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>
                <div className="p-4">
                    {children}
                </div>
            </section>
        </main>
    )
}
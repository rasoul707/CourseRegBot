"use client"

import React from "react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Tab, Tabs} from "@nextui-org/tabs";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/button";
import {usePathname} from "next/navigation";


export default function AdminLayout({children}: { children: React.ReactNode; }) {

    const pathname = usePathname()


    return (
        <main className="container mx-auto max-w-7xl flex-grow">
            <section className="flex flex-col justify-center gap-4">
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
                        <NavbarItem isActive={pathname === "/admin/payment"}>
                            <Link color={pathname === "/admin/payment" ? "primary" : "foreground"} href="/admin/payment">
                                پرداخت ها
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>
                {children}
            </section>
        </main>
    )
}
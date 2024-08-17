import "@/styles/globals.css";
import {Metadata, Viewport} from "next";

import {Providers} from "./providers";

import {siteConfig} from "@/config/site";
import {IRANSansX} from "@/lib/font";
import {Button} from "@nextui-org/button";
import React, {Suspense} from "react";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "white"},
        {media: "(prefers-color-scheme: dark)", color: "black"},
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <html
            lang="fa-IR"
            dir="rtl"
            className="selection:bg-primary/25 selection:text-primary select-none h-full"
            suppressHydrationWarning
        >
        <head>
            <script src="https://telegram.org/js/telegram-web-app.js"/>
        </head>
        <body
            className={["min-h-screen bg-gradient-to-bl from-[#02AABD] to-[#00CDAC] overflow-hidden antialiased scroll-smooth h-full", IRANSansX.className].join(" ")}
        >
        <Providers themeProps={{attribute: "class", defaultTheme: "light"}}>
            <Suspense>
                <div className="relative flex flex-col h-screen">
                    {children}
                </div>
            </Suspense>
        </Providers>
        </body>
        </html>
    );
}

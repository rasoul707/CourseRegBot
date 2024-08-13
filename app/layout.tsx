import "@/styles/globals.css";
import {Metadata, Viewport} from "next";

import {Providers} from "./providers";

import {siteConfig} from "@/config/site";
import {IRANSansX} from "@/lib/font";
import {Button} from "@nextui-org/button";
import React from "react";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "white"},
        {media: "(prefers-color-scheme: dark)", color: "black"},
    ],
};

export default function RootLayout({children,}: { children: React.ReactNode; }) {
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
            <div className="relative flex flex-col h-screen">
                <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                    {children}
                </main>
                <footer className="w-full flex items-center justify-center p-3">
                    <Button
                        fullWidth
                        size="lg"
                        color="primary"
                    >
                        پرداخت
                    </Button>
                </footer>
            </div>
        </Providers>
        </body>
        </html>
    );
}

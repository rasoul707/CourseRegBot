import React from "react";
import {Card, CardBody} from "@heroui/card";


export default function Layout({children}: { children: React.ReactNode; }) {
    return (
        <main className="container mx-auto max-w-7xl p-8 flex-grow overflow-hidden">
            <section className="flex flex-col h-full items-center justify-center gap-4 md:py-10">
                <Card fullWidth className="h-full">
                    <CardBody className="text-start">
                        {children}
                    </CardBody>
                </Card>
            </section>
        </main>
    )
}

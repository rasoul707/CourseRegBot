import {Card,  CardHeader} from "@nextui-org/card";
import React from "react";



export default function Page() {


    return (
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <Card fullWidth>
                    <CardHeader
                        className="font-black text-blue-900 text-lg text-center items-center justify-center flex flex-col gap-2"
                    >
                        <span>ربات ثبت نام سریع کلاس</span>
                    </CardHeader>
                </Card>
            </section>
        </main>
    )
}




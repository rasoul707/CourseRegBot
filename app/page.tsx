"use client"

import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Radio, RadioGroup} from "@nextui-org/radio";


export default function Page() {



    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <Card fullWidth className="">
                <CardHeader
                    className="font-black text-blue-900 text-lg text-center items-center justify-center flex flex-col gap-2">
                    <img src="/logo.png" className="h-28 py-4" alt="logo"/>
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
                            classNames={{labelWrapper: "gap-2", }}
                        >
                            <span className="font-bold text-base">پرداخت ریالی</span>
                        </Radio>
                        <Radio
                            value="usdt"
                            description="130 تتر"
                            classNames={{labelWrapper: "gap-2", }}
                            isDisabled
                        >
                            <span className="font-bold text-base">پرداخت تتری</span>
                        </Radio>
                    </RadioGroup>
                </CardBody>
            </Card>
        </section>
    );
}




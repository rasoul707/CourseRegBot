"use client"

import {Tab, Tabs} from "@nextui-org/tabs";
import {Card, CardBody, CardHeader} from "@nextui-org/card";


export default function Page() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <Tabs color="primary" fullWidth variant="bordered" selectedKey="irr" size="lg" classNames={{panel: "w-full"}}>
                <Tab key="usdt"  title="پرداخت تتری" isDisabled>
                    <Card fullWidth>
                        <CardHeader>
                            ثبت نام دوره جامع ترید
                        </CardHeader>
                        <CardBody >
                             به مبلغ 15,000,000 تومانءء
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="irr" title="پرداخت ریالی">
                    <Card fullWidth>
                        <CardHeader className="font-black text-primary">
                            ثبت نام دوره جامع ترید
                        </CardHeader>
                        <CardBody className="">
                            به مبلغ 15,000,000 تومانءء
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </section>
    );
}

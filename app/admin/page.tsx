"use client"


import {Card, CardBody, CardHeader} from "@heroui/card";
import {axiosNoAuth} from "@/lib/axios";
import {useEffect, useState} from "react";

export default function Page() {

    const [data, setData] = useState<any>(null)
    const getDashboard = async () => {
        const dashboard = await axiosNoAuth.get("dashboard")
        setData(dashboard.data)
    }

    useEffect(() => {
        getDashboard()
    }, []);

    return (
        <Card>
            <CardHeader className="justify-between">
                <h5 className="font-bold text-lg">داشبورد</h5>
            </CardHeader>
            <CardBody className="items-start">
                <ul className="flex flex-col gap-3">
                    <li className="flex gap-2 items-center">
                        <span className="font-bold">تعداد کل دوره ها:</span>
                        <span>{data?.courseCount || "0"}</span>
                    </li>
                    <li className="flex gap-2 items-center">
                        <span className="font-bold">تعداد کل کاربران:</span>
                        <span>{data?.userCount || "0"}</span>
                    </li>
                </ul>
            </CardBody>
        </Card>
    );
}




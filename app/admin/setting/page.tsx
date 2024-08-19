"use client"


import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import React, {useEffect, useState} from "react";
import {axiosNoAuth} from "@/lib/axios";
import {Input} from "@nextui-org/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "@/lib/toast";
import {z} from "zod";
import {Spinner} from "@nextui-org/spinner";


export default function Page() {
    const [isDataLoading, setDataLoading] = React.useState(true);
    const [data, setData] = useState<any>(null)
    const getData = async () => {
        try {
            const {data} = await axiosNoAuth.get("setting")
            setData(data.setting)
            setDataLoading(false)
        } catch (e) {
            setDataLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, []);


    type SettingFormType = {
        supportUsername: string;
        adminChannelId: string;
    };


    useEffect(() => {
        reset(
            {
                supportUsername: data?.supportUsername || "",
                adminChannelId: data?.adminChannelId || "",
            })
    }, [data])


    const {
        register,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: {errors, isLoading, isSubmitting, isValidating, isSubmitSuccessful},
    } = useForm<SettingFormType>();


    const {...supportUsernameField} = register("supportUsername")
    const {...adminChannelIdField} = register("adminChannelId")


    const onSubmit: SubmitHandler<SettingFormType> = async (_data) => {
        await submit(validate(_data))
    }


    const validate = (_data: SettingFormType) => {
        const shape = {
            supportUsername: z.string().min(4, "یوزرنیم پشتبان معتبر نیست"),
            adminChannelId: z.string().regex(/^-\d+$/, "آیدی چنل ادمین معتبر نیست"),
        }
        const {success, data, error} = z.object(shape).safeParse(_data);
        if (!success) {
            const issues = error.issues
            for (let i = 0; i < issues.length; i++) {
                setError(issues[i].path.join(".") as any, {message: issues[i].message})
            }
            throw {
                field: issues[0].path.join("."),
                message: issues[0].message
            }
        }
        return data
    }


    const submit = async (data: any) => {
        try {
            await axiosNoAuth.patch(`setting`, data)
            toast.success("با موفقیت ویرایش شد")
        } catch (e: any) {
            throw ""
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="justify-between">
                    <h5 className="font-bold text-lg">تنظیمات</h5>
                </CardHeader>
                <CardBody className="text-start">
                    {isDataLoading && (
                        <div className="flex justify-center items-center py-8">
                            <Spinner/>
                        </div>
                    )}
                    {!isDataLoading && (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                            <Input
                                label="یوزرنیم پشتیبانی"
                                dir="ltr"
                                {...supportUsernameField}
                                // isDisabled={isSubmitSuccessful}
                                isReadOnly={isSubmitting || isDataLoading}
                                isInvalid={!!errors.supportUsername}
                                errorMessage={errors.supportUsername?.message}
                                description="بدون @ وارد شود: admin_shop"
                            />
                            <Input
                                label="شناسه کانال مدیریت"
                                dir="ltr"
                                type="tel"
                                {...adminChannelIdField}
                                // isDisabled={isSubmitSuccessful}
                                isReadOnly={isSubmitting || isDataLoading}
                                isInvalid={!!errors.adminChannelId}
                                errorMessage={errors.adminChannelId?.message}
                                description="شناسه عددی کانال: 14514523655"
                            />
                        </form>
                    )}
                </CardBody>
                <CardFooter>
                    <Button
                        variant="shadow"
                        color="primary"
                        type="submit"
                        onPress={() => handleSubmit(onSubmit)()}
                        // isDisabled={isSubmitSuccessful}
                        isLoading={isSubmitting}
                    >
                        اعمال
                    </Button>
                </CardFooter>
            </Card>

        </>
    );
}


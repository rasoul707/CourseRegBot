"use client"


import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import React, {useEffect, useState} from "react";
import {axiosNoAuth} from "@/lib/axios";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Chip} from "@nextui-org/chip";
import {Image} from "@nextui-org/image";
import {Tooltip} from "@nextui-org/tooltip";
import {EditIcon} from "@nextui-org/shared-icons";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {UseDisclosureReturn} from "@nextui-org/use-disclosure";
import {Input} from "@nextui-org/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {Checkbox} from "@nextui-org/checkbox";
import {Spinner} from "@nextui-org/spinner";
import {toast} from "@/lib/toast";
import {z} from "zod";


const columns = [
    {name: "عنوان", uid: "title"},
    {name: "قیمت", uid: "price"},
    {name: "وضعیت", uid: "status"},
    {name: "", uid: "tools"},
];

export default function Page() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [courses, setCourses] = useState<any>([])
    const getCourses = async () => {
        try {
            const {data} = await axiosNoAuth.get("course")
            setCourses(data.courses)
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCourses()
    }, []);

    type Course = typeof courses[0];

    const renderCell = React.useCallback((c: Course, columnKey: React.Key) => {
        const cellValue = c[columnKey as keyof Course];

        switch (columnKey) {
            case "title":
                return (
                    <div className="flex items-center gap-3">
                        <Image
                            src={c.image}
                            height={80}
                            width={80}
                            className="min-w-20"
                        />
                        <span className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <span className="font-bold">
                                    شناسه:
                                </span>
                                <span className="select-all">
                                    {c.id}
                                </span>
                            </div>
                            <h5 className="font-black text-lg truncate">
                                {cellValue}
                            </h5>
                        </span>
                    </div>
                )
            case "price":
                return (
                    <span className="flex flex-col truncate">
                        {cellValue.toLocaleString()} ریالء
                    </span>
                );
            case "status":
                if (c.isActive) {
                    return <Chip color="success" className="text-white">فعال</Chip>
                } else {
                    return <Chip color="danger" className="text-white">غیرفعال</Chip>
                }
            case "tools":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="ویرایش" color="foreground" showArrow>
                            <Button
                                isIconOnly
                                color="primary"
                                variant="light"
                                radius="full"
                                onPress={() => {
                                    setEditingId(c.id)
                                    addCourseModal.onOpen()
                                }}
                            >
                                <EditIcon/>
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);


    const addCourseModal = useDisclosure({defaultOpen: false});
    const [editingId, setEditingId] = useState<number | null>(null)

    return (
        <>
            <Card>
                <CardHeader className="justify-between">
                    <h5 className="font-bold text-lg">مدیریت کلاس ها</h5>
                    <Button
                        variant="shadow"
                        color="primary"
                        onPress={() => {
                            setEditingId(null)
                            addCourseModal.onOpen()
                        }}
                    >
                        افزودن کلاس جدید
                    </Button>
                </CardHeader>
                <CardBody className="items-start">
                    <Table>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            items={courses}
                            isLoading={isLoading}
                            loadingContent={<Spinner label="در حال دریافت..."/>}
                            emptyContent={"موردی یافت نشد"}
                        >
                            {(item: Course) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
            <AddCourseModal
                state={addCourseModal}
                id={editingId}
                update={() => getCourses()}
            />
        </>
    );
}


const AddCourseModal = ({state, id, update}: { state: UseDisclosureReturn; id: number | null; update: () => void }) => {

    type CourseFormType = {
        title: string;
        image: string;
        price: string;
        uuid: string;
        isActive: boolean;
    };


    const onClose = () => {
        state.onClose()
    }


    const [course, setCourse] = useState<any>(null)
    const onGetCourse = async () => {
        if (!id) {
            setCourse(null)
            return
        }
        const {data} = await axiosNoAuth.get("course/" + id)
        setCourse(data.course)
    }

    useEffect(() => {
        if (state.isOpen) onGetCourse()
    }, [state.isOpen, id])

    useEffect(() => {
        reset(
            {
                title: course?.title || "",
                image: course?.image || "",
                price: course?.price.toString() || "",
                isActive: course?.isActive || true,
                uuid: course?.uuid || ""
            })
    }, [course])


    const {
        register,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: {errors, isLoading, isSubmitting, isValidating, isSubmitSuccessful},
    } = useForm<CourseFormType>();


    const {...titleField} = register("title")
    const {...imageField} = register("image")
    const {...priceField} = register("price")
    const {...isActiveField} = register("isActive", {value: true})
    const {...uuidField} = register("uuid")


    const onSubmit: SubmitHandler<CourseFormType> = async (_data) => {
        await submit(validate(_data))
    }


    const validate = (_data: CourseFormType) => {
        const shape = {
            title: z.string().min(3, "عنوان کوتاه است"),
            image: z.string().url("آدرس تصویر نامعتبر است"),
            price: z.string().regex(/^\d+$/, "قیمت نامعتبر است").transform(Number),
            isActive: z.boolean(),
            uuid: z.string().min(8, "شناسه کوتاه است"),
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
            if (!!id) {
                await axiosNoAuth.patch(`/course/${id}`, data)
                toast.success("با موفقیت ویرایش شد")
            } else {
                await axiosNoAuth.post(`/course`, data)
                toast.success("با موفقیت ایجاد شد")
            }
            onClose()
            update()
            return
        } catch (e: any) {
            onClose()
            throw ""
        }
    }


    return (
        <>
            <Modal
                //
                backdrop="blur"
                isOpen={state.isOpen}
                onClose={onClose}
                placement="bottom-center"
                scrollBehavior="inside"
                isDismissable
            >
                <ModalContent>

                    {(!!id && !course || !id && !!course)
                        ?
                        (
                            <div className="flex justify-center items-center py-8">
                                <Spinner/>
                            </div>
                        )
                        :
                        (
                            <>
                                <ModalHeader>
                                    {course ? "ویرایش کلاس" : "افزودن کلاس جدید"}
                                </ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                        <Input
                                            label="عنوان"
                                            {...titleField}
                                            isDisabled={isSubmitSuccessful}
                                            isReadOnly={isSubmitting}
                                            isInvalid={!!errors.title}
                                            errorMessage={errors.title?.message}
                                        />
                                        <Input
                                            label="آدرس بنر"
                                            dir="ltr"
                                            {...imageField}
                                            isDisabled={isSubmitSuccessful}
                                            isReadOnly={isSubmitting}
                                            isInvalid={!!errors.image}
                                            errorMessage={errors.image?.message}
                                        />

                                        <Input
                                            label="هزینه ثبت نام"
                                            dir="ltr"
                                            type="tel"
                                            {...priceField}
                                            isDisabled={isSubmitSuccessful}
                                            isReadOnly={isSubmitting}
                                            isInvalid={!!errors.price}
                                            errorMessage={errors.price?.message}
                                            description="به ریال وارد شود"
                                        />
                                        <Input
                                            label="شناسه ارجاع"
                                            dir="ltr"
                                            {...uuidField}
                                            isDisabled={isSubmitSuccessful}
                                            isReadOnly={isSubmitting}
                                            isInvalid={!!errors.uuid}
                                            errorMessage={errors.uuid?.message}
                                            description="شناسه ارجاع در اپلیکیشن مربوط وارد شود"
                                        />
                                        <Checkbox
                                            {...isActiveField}
                                            isDisabled={isSubmitSuccessful}
                                            isReadOnly={isSubmitting}
                                            isInvalid={!!errors.isActive}
                                        >
                                            فعال
                                        </Checkbox>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        variant="flat"
                                        color="default"
                                        onPress={onClose}
                                        isDisabled={isSubmitSuccessful || isSubmitting}
                                    >
                                        انصراف
                                    </Button>
                                    <Button
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        onPress={() => handleSubmit(onSubmit)()}
                                        isDisabled={isSubmitSuccessful}
                                        isLoading={isSubmitting}
                                    >
                                        اعمال
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </>
    )
}


"use client"


import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import React, {useEffect, useState} from "react";
import {axiosNoAuth} from "@/lib/axios";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Chip} from "@nextui-org/chip";
import {Tooltip} from "@nextui-org/tooltip";
import {EyeIcon, InfoIcon} from "@nextui-org/shared-icons";
import {Spinner} from "@nextui-org/spinner";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";


const columns = [
    {name: "مشخصات اکانت", uid: "info"},
    {name: "شماره موبایل", uid: "phoneNumber"},
    {name: "وضعیت", uid: "status"},
    {name: "دسترسی مدیریت", uid: "admin"},
    {name: "", uid: "tools"},
];

export default function Page() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [users, setUsers] = useState<any>([])
    const getUsers = async () => {
        try {
            const {data} = await axiosNoAuth.get("user")
            setUsers(data.users)
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getUsers()
    }, []);

    type Course = typeof users[0];

    const renderCell = React.useCallback((c: Course, columnKey: React.Key) => {
        const cellValue = c[columnKey as keyof Course];

        switch (columnKey) {
            case "info":
                return (
                    <div className="flex flex-col gap-2 truncate">
                        <div className="flex gap-2">
                            <span className="font-bold">
                                شناسه:
                            </span>
                            <span className="select-all">
                                {c.id}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold">
                                نام:
                            </span>
                            <span>
                                {c.firstName || "-"}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold">
                                نام خانوادگی:
                            </span>
                            <span>
                                {c.lastName || "-"}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold">
                                نام کاربری:
                            </span>
                            <span className="select-all">
                                {c.username || "-"}
                            </span>
                        </div>
                    </div>
                )
            case "phoneNumber":
                return (
                    <span className="">
                        {<span dir="ltr" className="select-all text-blue-500">{cellValue}</span> || <Chip variant="faded" color="default">ثبت نشده</Chip>}
                    </span>
                );
            case "status":
                if (c.isActive) {
                    return <Chip color="success" className="text-white">فعال</Chip>
                } else {
                    return <Chip color="danger" className="text-white">غیرفعال</Chip>
                }
            case "admin":
                if (c.isAdmin) {
                    return <Chip color="success" className="text-white">دارد</Chip>
                } else {
                    return <Chip color="danger" className="text-white">ندارد</Chip>
                }
            case "tools":
                return (
                    <div className="relative flex items-center gap-2">
                        <CoursesTool id={c.id}/>
                        <PaymentsTool id={c.id}/>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);


    return (
        <>
            <Card>
                <CardHeader className="justify-between">
                    <h5 className="font-bold text-lg">مدیریت کاربران</h5>
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
                            items={users}
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
        </>
    );
}


const CoursesTool = ({id}: { id: number }) => {
    const modal = useDisclosure({defaultOpen: false});

    useEffect(() => {
        if (modal.isOpen) getData()
    }, [modal.isOpen]);

    const [list, setList] = useState([])
    const [isLoading, setLoading] = useState(true)

    const getData = async () => {
        try {
            // const {data} = await axiosNoAuth.get("user")
            // setList(data.list)
            // setLoading(false)
        } catch (e) {
            // setLoading(false)
        }
    }


    return (
        <>
            <Modal
                //
                backdrop="blur"
                isOpen={modal.isOpen}
                onClose={modal.onClose}
                placement="bottom-center"
                isDismissable
            >
                <ModalContent>
                    <ModalHeader>
                        مشاهده لیست کلاس های کاربر
                    </ModalHeader>
                    <ModalBody>
                        -----
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            color="default"
                            onPress={modal.onClose}
                        >
                            باشه!
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Tooltip content="مشاهده لیست کلاس ها" color="foreground" showArrow>
                <Button
                    isIconOnly
                    color="primary"
                    variant="light"
                    radius="full"
                    onPress={modal.onOpen}
                >
                    <InfoIcon fontSize={24}/>
                </Button>
            </Tooltip>
        </>
    )
}


const PaymentsTool = ({id}: { id: number }) => {
    const modal = useDisclosure({defaultOpen: false});

    useEffect(() => {
        if (modal.isOpen) getData()
    }, [modal.isOpen]);

    const [list, setList] = useState([])
    const [isLoading, setLoading] = useState(true)

    const getData = async () => {
        try {
            // const {data} = await axiosNoAuth.get("user")
            // setList(data.list)
            // setLoading(false)
        } catch (e) {
            // setLoading(false)
        }
    }
    return (
        <>
            <Modal
                //
                backdrop="blur"
                isOpen={modal.isOpen}
                onClose={modal.onClose}
                placement="bottom-center"
                isDismissable
            >
                <ModalContent>
                    <ModalHeader>
                        مشاهده لیست پرداخت های کاربر
                    </ModalHeader>
                    <ModalBody>
                        -----
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            color="default"
                            onPress={modal.onClose}
                        >
                            باشه!
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Tooltip content="مشاهده پرداخت ها" color="foreground" showArrow>
                <Button
                    isIconOnly
                    color="secondary"
                    variant="light"
                    radius="full"
                    onPress={modal.onOpen}
                >
                    <EyeIcon fontSize={24}/>
                </Button>
            </Tooltip>
        </>
    )
}

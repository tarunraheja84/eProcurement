"use client"
import React from 'react'
import { convertDateTime, statusColor } from '@/utils/helperFrontendFunctions';
import axios from 'axios';
import { Order, OrderItem } from '@/types/order';
import { OrderStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Image from "next/image";

type Props = {
    order: Order,
    isViewOnly : boolean
}
const OrderDetail = ({ order, isViewOnly }: Props) => {
    const orderId = order.orderId
    const router = useRouter()
    async function handleCancelOrder(): Promise<void> {
        try {
            delete order.orderId
            order.status = OrderStatus.CANCELLED
            order.cancellationDate = new Date()
            await axios.put("/api/orders/update", { order, orderId })
            alert("Order Cancelled Successfully!");
            router.refresh();
        }catch (err) {
            alert("Failed please try again later!");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-custom-red mb-4">Order Details</h1>
            <hr className="border-custom-red border mb-4" />

            <div className="h-full flex flex-col justify-between">
                <div className="p-4 rounded-lg flex flex-col justify-between md:flex-row">
                    <div>
                        <div className="mb-2">
                            <span className="font-bold">Order Id: </span>{order.orderId}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Quotation Id:</span> {order.quotationId}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">MarketPlace orderId:</span> <a href={order.marketPlaceOrderUrl} target="_blank" className="underline text-custom-link-blue cursor-pointer break-all">{order.marketPlaceOrderId}</a>
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Status:</span> <span className={statusColor(order.status)}>{order.status}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Total:</span> <span className="text-custom-green">₹{order.total}</span>
                        </div>
                    </div>
                    <div className="">
                        {order.status === OrderStatus.PENDING && <div className="flex space-x-4 mb-2">
                            <button className="bg-custom-red hover:bg-hover-red text-white px-4 py-2 rounded-md " onClick={handleCancelOrder}>Cancel Order</button>
                        </div>}
                        <div className="mb-2">
                            <span className="font-bold">Created By: </span>{order.createdBy}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Created At: </span>{convertDateTime(order.createdAt!.toString())}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Updated By: </span>{order.updatedBy}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Updated At: </span>{convertDateTime(order.updatedAt!.toString())}
                        </div>
                        {order.status === OrderStatus.CANCELLED && <div className="mb-2">
                            <span className="font-bold">Cancelled At: </span><span className='bg-custom-yellow'>{convertDateTime(order.cancellationDate!.toString())}</span>
                        </div>}
                        {order.status === OrderStatus.DELIVERED && <div className="mb-2">
                            <span className="font-bold">Delivered At: </span><span className='bg-custom-yellow'>{convertDateTime(order.deliveryDate!.toString())}</span>
                        </div>}
                    </div>

                </div>

                <div>
                    <div className={`flex flex-col md:flex-row justify-between`}>
                        <h2 className="md:text-2xl mb-4">Order Items</h2>
                        <div className="text-sm md:text-base">Total Items: {order.orderItems!.length}</div>
                    </div>
                </div>
                <div className="my-2 max-h-[450px] overflow-y-auto">
                    {
                        order.orderItems && order.orderItems.map((order: OrderItem, index: number) => {
                            return <div key={index} className='relative flex flex-col bg-white m-2 border rounded border-custom-gray-3'>
                                <div className='flex flex-row items-center'>
                                    <div className="flex flex-col md:flex-row ml-2 md:ml-0 items-center w-full md:gap-4">
                                        <div className='flex flex-row'>
                                            <div className='w-24 h-14'>
                                            <Image
                                                src={order.imgPath ?? ""}
                                                alt={order.productName ?? ""}
                                                width={100}
                                                height={100}
                                                className='border rounded md:w-20 md:h-20 m-1'
                                            />
                                            </div>
                                            <div className='flex flex-col p-4 w-full cursor-pointer'>
                                                <div className='text-sm md:text-base font-semibold'>{order.productName}</div>
                                                <div className='text-sm md:text-base'>{order.packSize}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-evenly w-full">
                                            {/* <div>
                                                <div className='text-sm md:text-base font-semibold'>Category: <span className="text-custom-blue">{order.category}</span></div>
                                                <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-custom-pink">{order.subCategory}</span></div>
                                            </div> */}
                                            <div className='flex flex-col justify-between md:justify-end mt-2 md:mt-0 mx-2'>
                                                <div className='text-sm md:text-base font-semibold'>Ordered Quantity: <span className="text-custom-yellow">{order.orderedQty}</span></div>
                                                <div className='text-sm md:text-base font-semibold'>Received Quantity: <span className="text-custom-indigo">{order.receivedQty}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:absolute m-2 top-0 right-0 cursor-pointer">
                                        <h5 className="text-base font-medium">Total lineItem Price : ₹ <span className='text-green-500'>{order.totalAmount}</span></h5>
                                        {order.totalTax > 0 && <h5 className="text-base font-medium">Tax Amount : ₹ <span className='text-green-500'> {order.totalTax} </span></h5>}
                                    </div>
                                </div>
                            </div>
                        }
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default OrderDetail

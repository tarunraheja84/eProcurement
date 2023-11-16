"use client"
import { OrderStatus } from '@/types/enums';
import React from 'react'

const ViewOrder = ({ order }: any) => {

    const convertDateTime=(dateString:string)=>{
        const date = new Date(dateString);
    
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
    
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours to 12-hour format
        const hours12 = hours % 12 || 12;
    
        const formattedDate = `${dayOfWeek} ${month} ${day}, ${year}`;
        const formattedTime = `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    
        return `${formattedDate} ${formattedTime}`;
    }

    const statusColor=(orderStatus:String)=>{
        switch (orderStatus) {
            case OrderStatus.PENDING:
                return "text-custom-yellow";
            case OrderStatus.CANCELLED:
                return "text-red-400"; 
            case OrderStatus.DELIVERED:
                return "text-custom-green" 
        }
    }
    return (
        <div className="h-full flex flex-col justify-between">
            <div className="p-4 rounded-lg flex flex-col justify-between md:flex-row">
                <div className="">
                    <div className="mb-2">
                        <span className="font-bold">Order Id: </span>{order.orderId}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Quotation Id:</span> {order.quotationId}
                    </div>
                    <div className="mb-2">
                    <span className="font-bold">MarketPlace orderId:</span> <a href={order.marketPlaceOrderUrl} target="_blank" className="underline text-blue-700 cursor-pointer break-all">{order.marketPlaceOrderId}</a>
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Status:</span> <span className={statusColor(order.status)}>{order.status}</span>
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Total:</span> <span className="text-custom-green">₹{order.total}</span>
                    </div>
                </div>
                <div className="">
                    <div className="mb-2">
                        <span className="font-bold">Created By: </span>{order.createdBy}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Created At: </span>{convertDateTime(order.createdAt.toString())}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Updated By: </span>{order.updatedBy}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Updated At: </span>{convertDateTime(order.updatedAt.toString())}
                    </div>
                </div>

            </div>

            <div>
                <div className={`flex flex-col md:flex-row justify-between`}>
                    <h2 className="md:text-2xl mb-4">Order Items</h2>
                    <div className="text-sm md:text-base">Total Items: {order.orderItems!.length}</div>
                </div>
            </div>
            <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
                {
                    order.orderItems && order.orderItems.map((order: any, index: number) => {
                        return <div key={index} className='relative flex flex-col bg-white m-2 border rounded border-gray-400'>
                            <div className='flex flex-row items-center'>
                                <div className="flex flex-col md:flex-row ml-2 md:ml-0 items-center w-full md:gap-4">
                                    <div className='flex flex-row'>
                                        <img src={order.imgPath} className='w-14 h-14 border rounded border-grey md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                                        <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                                            <div className='text-sm md:text-base font-semibold'>{order.productName}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-evenly w-full">
                                    <div>
                                        <div className='text-sm md:text-base font-semibold'>Category: <span className="text-blue-400">{order.category}</span></div>
                                        <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-pink-300">{order.subCategory}</span></div>
                                    </div>
                                <div className='flex flex-col justify-between md:justify-end mt-2 md:mt-0 mx-2'>
                                    <div className='text-sm md:text-base font-semibold'>Ordered Quantity: <span className="text-orange-300">{order.orderedQty}</span></div>
                                    <div className='text-sm md:text-base font-semibold'>Received Quantity: <span className="text-indigo-300">{order.receivedQty}</span></div>
                                </div>
                                </div>
                                </div>
                                <div className="md:absolute m-2 top-0 right-0 cursor-pointer">
                                    {order.unitPrice}*{order.receivedQty}+{order.totalTax}= <span className="text-custom-green">₹{order.total}</span>
                                </div>
                            </div>
                            <div className="flex md:flex-row m-2 justify-between">
                                <div className='border md:w-[145px] flex justify-center items-center pl-[10px] rounded-md focus:outline-none w-full' >
                                    {order.packSize}
                                </div>
                            </div>
                        </div>
                    }
                    )
                }
            </div>
        </div>
    )
}

export default ViewOrder

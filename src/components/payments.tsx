'use client'
import { Order } from '@/types/order'
import { Vendor } from '@/types/vendor'
import { PaymentType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React, { useState } from 'react'

interface Props {
    paymentType: PaymentType,
    orders: Order[],
    vendorId: string,
    vendor: Vendor,
}
const Payments = (props: Props) => {
    const router = useRouter()
    const isPrepaid = props.paymentType === PaymentType.PREPAID
    const orders = props.orders;
    const vendor = props.vendor
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(false)

    const toggleOrderSelection = (orderId: string) => {
        orders.map((order:Order) => {
            if (order.orderId === orderId){
                if (selectedOrders.includes(orderId)) {
                    setTotal(total - order.total)
                } else {
                    setTotal(total + order.total)

                }
            }
        })
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter((id: any) => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };
    function handlePayNow(): void {
        throw new Error('Function not implemented.')
    }

    function handleSelectAll() {
        if (isAllSelected) {
            setSelectedOrders([]);
            setIsAllSelected(false)
        }else{
            const orderIds = orders.map((order) => order.orderId || "");
            setSelectedOrders(orderIds)
            setIsAllSelected(true)
        }
    }

    return (
        <>
            <div className={`flex justify-between items-center pb-4 mb-2 sticky top-[3rem] z-[18] p-[1rem] bg-slate-200 border-4 shadow-lg flex-wrap`}>
                <div>
                    <div className="text-xl font-bold ">Vendor Orders Payment</div>
                </div>
                <div>
                    <div className="text-xl font-bold float-right">Total Amount to Pay: ₹ <span className='text-green-500'>{total}</span></div>
                </div>
                <Button className={`bg-custom-red px-5 py-3 text-white shadow-lg ${total <= 0 ? "bg-disable-grey pointer-events-none" : ""}`} onClick={handlePayNow}>Pay Now</Button>
            </div>
            <div className="flex flex-row items-center gap-8 items-baseline p-4 flex-wrap">
                <div className='flex'>
                    <h2 className="font-bold text-custom-red mb-4">Vendor Details : </h2>
                </div>
                <div className='flex'>
                    <p className="font-bold text-gray-600">Business Name: </p><span className="text-gray-600">{vendor?.businessName}</span>
                </div>
                <div className='flex'>
                    <p className="font-bold text-gray-600">Business Brand Name: </p><span className="text-gray-600">{vendor?.businessBrandName}</span>
                </div>
                <div className='flex'>
                    <p className="font-bold text-gray-600">Phone No :  </p><span className="text-gray-600">{vendor?.phoneNumber}</span>
                </div>
            </div>
            <div className="flex gap-1">
                <div className={`${isPrepaid ? "bg-custom-red" : "bg-custom-gray-4"} w-1/2 text-center py-2 cursor-pointer border-2 border-custom-gray-4 shadow-lg text-white`} onClick={() => router.push(`/payments/prepaid_payments/${props.vendorId}`)}>
                    PREPAID_PAYMENT
                </div>
                <div className={`${!isPrepaid ? "bg-custom-red" : "bg-custom-gray-4"} w-1/2 text-center py-2 cursor-pointer border-2 border-custom-gray-4 shadow-lg text-white`} onClick={() => router.push(`/payments/postpaid_payments/${props.vendorId}`)}>
                    POSTPAID_PAYMENT
                </div>
            </div>
            <div className="flex items-end gap-4 ">
                <p>Select All</p>
                <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-custom-red"
                    checked={isAllSelected}
                    onChange={() => {handleSelectAll()}}
                />
            </div>

            {props.orders.map((order: Order) => (
                <div
                    className={`rounded-lg shadow-md m-4 bg-white cursor-pointer ${selectedOrders.includes(order.orderId!) ? 'border-2 border-custom-red' : ''
                        }`}
                    key={Math.random()}
                    onClick={() => toggleOrderSelection(order.orderId!)}
                >
                    <div className="flex justify-between items-center border rounded-lg p-3 bg-gray-100 border-gray-300">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-red-500 text-sm">Order ID: {order.orderId}</h2>
                            <p className="text-gray-600 text-xs">Delivery Date: {order.deliveryDate?.toDateString()}</p>
                            <p className="text-gray-600 text-xs">Order Date: {order.createdAt?.toDateString()}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-600 text-xs">Status: {order.status}</p>
                            <p className="text-gray-600 text-xs">Total: <span className='text-green-500'>₹{order.total}</span></p>
                        </div>
                        <div className="flex flex-col items-end">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-custom-red"
                                checked={selectedOrders.includes(order.orderId!)}
                                onChange={() => { }}
                            />
                            <a href={`/orders/${order.orderId}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold hover:underline text-xs">View</a>
                        </div>
                    </div>


                    {/* Add more order details or components here if needed */}
                </div>
            ))}
        </>
    )

}

export default Payments

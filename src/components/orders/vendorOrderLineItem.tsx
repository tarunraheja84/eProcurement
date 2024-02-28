'use client'
import { Order, OrderItem } from "@/types/order";
import Image from "next/image";
import React, { useState } from 'react'
import { formatAmount } from "@/utils/helperFrontendFunctions";
import { OrderStatus } from "@prisma/client";
interface VendorLineItemComponentProps {
    order: Order,
    setOrder: React.Dispatch<React.SetStateAction<Order>>,
    lineItem: OrderItem
}
const VendorOrderLineItem: React.FC<VendorLineItemComponentProps> = ({ lineItem, order, setOrder }) => {
    const [itemTotalAmount, setItemTotalAmount] = useState<number>(formatAmount(lineItem.sellingPrice * lineItem.orderedQty))
    const [igst, cgst, sgst, cess] = lineItem.taxes ? [lineItem.taxes.igst ?? 0, lineItem.taxes.cgst ?? 0, lineItem.taxes.sgst ?? 0, lineItem.taxes.cess ?? 0] : [0, 0, 0, 0]
    const [itemTotalTaxRate, setItemTotalTaxRate] = useState<number>(igst ? igst + cess : cgst + sgst + cess);

    const handleAccept = () => {
        if (lineItem.isSellerAccepted) return;
        lineItem.isSellerAccepted = true;
        lineItem.acceptedQty = lineItem.orderedQty;
        let [lineItemTotal, lineItemTotalAmount, lineItemTotalTax] = [lineItem.total, lineItem.totalAmount, lineItem.totalTax]
        order.finalTotal = order.finalTotal + lineItemTotal;
        order.finalTotalTax = order.finalTotalTax + lineItemTotalTax;
        order.finalTotalAmount = order.finalTotalAmount + lineItemTotalAmount;
        setOrder({
            ...order
        })
    };

    const handleReject = () => {
        if (!lineItem.isSellerAccepted) return;
        lineItem.isSellerAccepted = false;
        lineItem.acceptedQty = 0;
        let [lineItemTotal, lineItemTotalAmount, lineItemTotalTax] = [lineItem.total, lineItem.totalAmount, lineItem.totalTax]
        order.finalTotal = order.finalTotal - lineItemTotal;
        order.finalTotalTax = order.finalTotalTax - lineItemTotalTax;
        order.finalTotalAmount = order.finalTotalAmount - lineItemTotalAmount;
        setOrder({
            ...order
        })
    };

    return (
        <>
            <div className="flex flex-col mt-4 border-2 rounded drop-shadow-md">
                <div className={`flex flex-row p-4 justify-between relative`} key={lineItem.id}>
                    <div className='flex flex-row'>
                        <Image
                            src={lineItem.imgPath ?? ""}
                            alt={lineItem.productName ?? ""}
                            width={100}
                            height={100}
                        />
                        <div className="ml-4 flex flex-col gap-[5px]">
                            <h4 className="text-lg font-medium">{lineItem.productName}</h4>
                            <h4 className="text-lg font-medium">{lineItem.packSize}</h4>
                            <div className='flex gap-[10px] items-center'>
                                <span className='text-lg'>{lineItem.orderedQty}</span>
                                <span>X</span>
                                <p className="text-base font-regular">{lineItem.unitPrice} ₹/unit</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-base font-medium">Total lineItem Price : ₹ <span className='text-custom-green'>{lineItem.totalAmount}</span></h5>
                        {itemTotalTaxRate != 0 && <h5 className="text-base font-medium">Tax Amount : ₹ <span className='text-custom-green'> {`${itemTotalAmount * itemTotalTaxRate / 100} (${itemTotalTaxRate}% gstRate)`} </span></h5>}
                    </div>
                </div>
                {order.status === OrderStatus.PENDING && <div className="flex space-x-4 p-4">
                    <button
                        onClick={() => handleAccept()}
                        className={`${lineItem.isSellerAccepted ? "bg-custom-green" : "bg-custom-gray-1"} hover:bg-hover-green text-custom-buttonText font-bold py-2 px-4 rounded focus:outline-none`}
                    >
                        {lineItem.isSellerAccepted ? "Accepted" : "Accept"}
                    </button>
                    <button
                        onClick={() => handleReject()}
                        className={`${lineItem.isSellerAccepted ? "bg-custom-gray-4" : "bg-custom-red"} hover:bg-hover-red text-custom-buttonText font-bold py-2 px-4 rounded focus:outline-none`}
                    >
                        {lineItem.isSellerAccepted ? "Reject" : "Rejected"}
                    </button>
                </div>}
            </div>

        </>
    )
}

export default VendorOrderLineItem
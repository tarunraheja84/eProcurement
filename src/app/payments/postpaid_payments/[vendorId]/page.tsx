import Payments from '@/components/payments'
import { OrderStatus, PaymentType } from '@prisma/client'
import React from 'react'

const page = async (context :any) => {
    const vendorId = context.params.vendorId;
    let [orders, vendor] : any= await Promise.all([// TODO: remove this any
        prisma.order.findMany({ 
            where : {
                vendorId : vendorId,
                status : OrderStatus.DELIVERED,
            },
            include : {
                vendor :true
            }
        }),
        prisma.vendor.findUnique({ 
            where : {
                vendorId : vendorId,
            }
        })
    ])
    console.log("DELIVERED" ,orders)
    return (
        <>
            <Payments paymentType={PaymentType.POSTPAID} orders={orders} vendorId={vendorId} vendor={vendor}/>
        </>
    )
}

export default page
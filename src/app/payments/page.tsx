import Payments from '@/components/payments/payments'
import { OrderStatus, PaymentType } from '@prisma/client'
import prisma from '@/lib/prisma';
import React from 'react'

const page = async () => {
    const today = new Date();

    let [orders, ordersCount]: any = await Promise.all([// TODO: remove this any
        prisma.order.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
            where: {
                status: {
                    in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED]
                },
                paymentType: PaymentType.NONE,
            },
            include: {
                vendor: true,
                payment: true
            }
        }),
        prisma.order.count({
            where: {
                status: {
                    in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED]
                },
                paymentType: PaymentType.NONE,
            }
        }),
    ])
    return (
        <>
            <Payments paymentType={PaymentType.POSTPAID} orders={orders} ordersCount={ordersCount} />
        </>
    )
}

export default page
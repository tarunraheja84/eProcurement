import React from 'react'
import prisma from '@/lib/prisma';
import QuotationTable from '@/components/quotations/QuotationsTable';
import { Quotation } from '@prisma/client';
import {
    subDays,
    endOfDay,
} from 'date-fns';
import { cookies } from 'next/headers';

const page = async () => {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
    const today = new Date();
    let quotations: Quotation[] = [], noOfQuotations: number = 0;

    [quotations, noOfQuotations] = await Promise.all([prisma.quotation.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        include: {
            vendor: true,
            procurement: true
        },
        where: {
            createdAt: {
                gte: subDays(today, 6),
                lte: endOfDay(today)
            },
            vendorId
        }
    }),
    prisma.quotation.count({
            where: { createdAt: {
                gte: subDays(today, 6),
                lte: endOfDay(today)
            },
            vendorId
        }
    })
    ]);
    return (
        <QuotationTable quotations={quotations} noOfQuotations={noOfQuotations}/>
    )
}

export default page
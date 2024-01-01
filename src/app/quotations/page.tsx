import React from 'react'
import prisma from '@/lib/prisma';
import QuotationTable from '@/components/quotations/QuotationTable';
import { Quotation } from '@prisma/client';
import {
    subDays,
    endOfDay,
} from 'date-fns';

const page = async () => {
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
        }
    }),
    prisma.quotation.count({
            where: { createdAt: {
                gte: subDays(today, 6),
                lte: endOfDay(today)
            }
        }
    })
    ]);
    return (
        <>
            <div className="flex justify-between items-center pb-4">
                <span className='text-2xl'>Quotations</span>
            </div>
            <QuotationTable quotations={quotations} noOfQuotations={noOfQuotations}/>
        </>
    )
}

export default page
import React from 'react'
import prisma from '@/lib/prisma';
import QuotationTable from '@/components/quotations/QuotationsTable';
import { Quotation } from '@prisma/client';

const page = async () => {
    let quotations: Quotation[] = [], noOfQuotations: number = 0;

    [quotations, noOfQuotations] = await Promise.all([prisma.quotation.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        include: {
            vendor: true,
            procurement: true,
            products:{
                select:{
                    sellerProductId: true
                }
            }
        },
    }),
    prisma.quotation.count({})
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
import React from 'react'
import prisma from '@/lib/prisma';
import { Quotation } from '@/types/quotation';
import QuotationTable from '@/components/quotationTable';
import TableHeader from '@/components/tableHeader';
import { QuotationStatus } from '@/types/enums';

const page = async () => {
    const quotations: any = await prisma.quotation.findMany({//TODO: remove this 
        orderBy: {
            updatedAt: 'desc'
        },
        include: {
            vendor: true,
            procurement: true,
        },
        where: {
            status: QuotationStatus.ACCEPTED
        }
    })
    return (
        <>
            <div className="flex justify-between items-center pb-4">
                <span>Quotations</span>
            </div>
            <QuotationTable quotations={quotations} />
        </>
    )
}

export default page
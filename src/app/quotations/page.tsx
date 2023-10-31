import React from 'react'
import prisma from '@/lib/prisma';
import { Quotation } from '@/types/quotation';
import QuotationTable from '@/components/quotationTable';
import TableHeader from '@/components/tableHeader';

const page = async () => {
    const quotations: any = await prisma.quotation.findMany({ //TODO: required type
        orderBy: {
            updatedAt: 'desc'
        },
        include: {
            quotationProducts: true,
            vendor: true,
            procurement: true,
        },
    })
    return (
        <>
            <TableHeader heading="View Quotation" buttonText="Create New" route="/quotations/create" />
            <QuotationTable quotations={quotations} />
        </>
    )
}

export default page
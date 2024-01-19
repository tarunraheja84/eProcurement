import React from 'react'
import { cookies } from 'next/headers';
import { QuotationStatus } from '@prisma/client';
import ViewQuotation from '@/components/quotations/ViewQuotation';

const page = async () => {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
    const quotations = await prisma.quotation.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        where: {
            vendorId: vendorId,
            status: QuotationStatus.ACCEPTED
        },
        include: {
            products: true,
        }
    });

    return (
        <>
            {quotations.length > 0 ? <ViewQuotation quotation={quotations[0]} /> :
                <div className="w-full text-center">No Active Quotation at this time</div>}
        </>
    )
}

export default page
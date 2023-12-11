import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationRequest, QuotationRequestStatus } from '@prisma/client';

const page = async () => {

    const quotationsRequests :QuotationRequest[] = await prisma.quotationRequest.findMany({
        where: {
            status: QuotationRequestStatus.ACTIVE
        }
    })
    return (
        <div>page</div>
    )
}

export default page
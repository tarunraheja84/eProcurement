import { QuotationRequestStatus, QuotationStatus } from '@/types/enums'
import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationRequest } from '@prisma/client';

const page = async () => {

    const quotationsRequests :QuotationRequest[] = await prisma.quotationRequest.findMany({
        where: {
            status: QuotationRequestStatus.ACTIVE
        }
    })
    console.log('quotationsRequests :>> ', quotationsRequests);
    return (
        <div>page</div>
    )
}

export default page
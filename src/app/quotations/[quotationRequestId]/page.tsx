import QuotationForm from '@/components/quotationForm'
import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationRequest } from '@/types/quotationRequest';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;
  const quotationRequest: QuotationRequest | null = await prisma.quotationRequest.findUnique({
    where: {
      quotationRequestId: quotationRequestId
    },
    include: {
      vendors: true
    }
  }
  )

  return (
    <>
      <QuotationForm isForUpdate={true} quotationRequest={quotationRequest} />
    </>
  )
}

export default page
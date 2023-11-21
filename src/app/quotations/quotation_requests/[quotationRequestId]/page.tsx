import QuotationRequestForm from '@/components/quotationRequestForm'
import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationRequest } from '@/types/quotationRequest';
import { QuotationRequestStatus } from '@/types/enums';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;
  const quotationRequest: any = await prisma.quotationRequest.findUnique({
    where: {
      quotationRequestId: quotationRequestId
    },
    include: {
      vendors: true
    }
  }
  )
  let isViewOnly = false;
  if (quotationRequest.status === QuotationRequestStatus.ACTIVE) isViewOnly = true;
  return (
    <>
      <QuotationRequestForm isForUpdate={true} quotationRequest={quotationRequest} isViewOnly={isViewOnly}/>
    </>
  )
}

export default page
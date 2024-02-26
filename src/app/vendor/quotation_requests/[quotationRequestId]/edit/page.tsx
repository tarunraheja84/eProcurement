import React from 'react'
import {  QuotationStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import QuotationForm from '@/components/quotations/QuotationForm';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;
  const cookieStore = cookies();
  const vendorId = cookieStore.get("vendorId")?.value

  const [quotationRequest, activeQuotationsOfSameVendor] = await Promise.all([
    prisma.quotationRequest.findUnique({
      where: {
        quotationRequestId
      },
      include: {
        products: true
      },
    }),
    prisma.quotation.findMany({
      where: {
        vendorId: vendorId,
        status:{
          in:[QuotationStatus.ACCEPTED, QuotationStatus.PENDING]
        } 
      },
      include: {
        products: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
    })
  ])

  return (
      <QuotationForm quotationRequest={quotationRequest} vendorId={vendorId!} activeQuotationsOfSameVendor={activeQuotationsOfSameVendor}/>
  )
}

export default page
import React from 'react'
import {  QuotationStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import QuotationForm from '@/components/quotations/QuotationForm';

const page = async (context: any) => {
  const quotationId = context.params.quotationId;
  const cookieStore = cookies();
  const vendorId = cookieStore.get("vendorId")?.value

  const [quotation, activeQuotationsOfSameVendor] = await Promise.all([
    prisma.quotation.findUnique({
      where: {
        quotationId
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
        }, 
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
      <QuotationForm quotation={quotation} activeQuotationsOfSameVendor={activeQuotationsOfSameVendor}/>
  )
}

export default page
import QuotationForm from '@/components/quotationForm'
import { Vendor } from '@prisma/client';
import React from 'react'
import prisma from '@/lib/prisma';

const page = async (context: any) => {
  const quotationId = context.params.quotationId;
  const quotation = await prisma.quotation.findUnique({where: {
    quotationId: quotationId
  }})
  return (
    <>
      <QuotationForm isForUpdate={true} quotation={quotation}/>
    </>
  )
}

export default page
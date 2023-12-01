import React from 'react'
import QuotationClient from './quotationClient';
import { Product } from '@/types/product'
import { QuotationStatus } from '@/types/enums';

const page = async (context: any) => {
  const quotationId = context.params.quotationId;
  const quotation: any = await prisma.quotation.findUnique({
    where: {
      quotationId: quotationId
    },
    include: {
      products: true,
      vendor : true
    }
  }
  )
  let isViewOnly = false;
  if (quotation.status === QuotationStatus.ACCEPTED) isViewOnly = true

  return (
    <>
      <QuotationClient quotation={quotation} isViewOnly={isViewOnly}/>
    </>
  )
}

export default page
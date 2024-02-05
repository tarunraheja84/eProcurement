import QuotationRequestForm from '@/components/quotation_requests/QuotationRequestForm'
import React from 'react'
import prisma from '@/lib/prisma';
import { VendorStatus } from '@prisma/client';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;
  const [quotationRequest, vendors] = await Promise.all([prisma.quotationRequest.findUnique({ 
    where: {
      quotationRequestId: quotationRequestId
    },
    include: {
      vendors: true,
      procurement: true,
      products:true
    }
  }
  ),
  prisma.vendor.findMany({
    where: {
      status: VendorStatus.ACTIVE
    },
    select : {
      vendorId : true,
      businessName : true
    }
  })
  ])

  return (
      <QuotationRequestForm quotationRequest={quotationRequest} vendorIdToBusinessNameMap={vendors} procurementId={context.searchParams.procurementId} context={context}/>
  )
}

export default page
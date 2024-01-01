import QuotationRequestForm from '@/components/quotation_requests/QuotationRequestForm'
import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationRequestStatus, VendorStatus } from '@prisma/client';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;
  const [quotationRequest, vendors] = await Promise.all([prisma.quotationRequest.findUnique({ 
    where: {
      quotationRequestId: quotationRequestId
    },
    include: {
      vendors: true,
      procurement: true
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
  // what is this feature
  // let isViewOnly = false;
  // if (quotationRequest && quotationRequest.status === QuotationRequestStatus.ACTIVE) isViewOnly = true;

  return (
    <>
      <QuotationRequestForm quotationRequest={quotationRequest} vendorIdToBusinessNameMap={vendors} procurementId={context.searchParams.procurementId} />
    </>
  )
}

export default page
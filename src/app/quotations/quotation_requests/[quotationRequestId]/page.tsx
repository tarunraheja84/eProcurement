import QuotationRequestForm from '@/components/quotationRequestForm'
import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationRequestStatus } from '@/types/enums';
import { Vendor, VendorStatus } from '@prisma/client';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;
  const [quotationRequest, vendors]:any = await Promise.all([prisma.quotationRequest.findUnique({ //TODO: remove any
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
  let isViewOnly = false;
  if (quotationRequest.status === QuotationRequestStatus.ACTIVE) isViewOnly = true;
  return (
    <>
      <QuotationRequestForm isForUpdate={true} quotationRequest={quotationRequest} isViewOnly={isViewOnly} vendorIdToBusinessNameMap={vendors} />
    </>
  )
}

export default page
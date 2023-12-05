import React from 'react'
import QuotaionClient from './quotaionClient'
import { QuotationStatus } from '@prisma/client';
import { cookies } from 'next/headers';

const page = async (context :any) => {
  const cookieStore = cookies();
  const vendorId = cookieStore.get("userId")?.value
  const quotationRequestId = context.params.quotationRequestId;
  const quotationRequest :any = await prisma.quotationRequest.findUnique({ //TODO: remove this any
    where : {
      quotationRequestId : quotationRequestId
    },
    include : {
      products :true
    }
  })
  let isVendorCanCreateQuotation = true
  const quotationsWithSameQuotReq = await prisma.quotation.findMany({
    where: {
      quotationRequestId: quotationRequestId,
      status: {
        in: [QuotationStatus.ACCEPTED, QuotationStatus.PENDING],
      },
      vendorId : vendorId
    },
  });
  if (quotationsWithSameQuotReq.length > 0) isVendorCanCreateQuotation = false;
  return (
    <>
    <QuotaionClient quotationRequest={quotationRequest} isVendor={true} isVendorCanCreateQuotation={isVendorCanCreateQuotation}/>
    </>
  )
}

export default page
import React from 'react'
import QuotaionClient from './quotaionClient'
import { QuotationStatus } from '@/types/enums';

const page = async (context :any) => {
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
      vendorId : "655b19edb7e8214a9bdde4de"
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
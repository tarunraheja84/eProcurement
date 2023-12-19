import React from 'react'
import QuotaionClient from './quotaionClient'
import { QuotationStatus } from '@prisma/client';

const page = async (context :any) => {
  const quotationRequestId = context.params.quotationRequestId;
  let isVendorCanCreateQuotation = true

  const [quotationRequest, quotationsWithSameQuotReq, activeQuotationsOfSameVendor]= await Promise.all([
    prisma.quotationRequest.findUnique({ 
      where : {
        quotationRequestId : quotationRequestId
      },
      include : {
        products :true
      }
    }),
    prisma.quotation.findMany({
      where: {
        quotationRequestId: quotationRequestId,
        status: {
          in: [QuotationStatus.ACCEPTED, QuotationStatus.PENDING],
        },
        vendorId : "65362fe43ee4ee234d73f4cc"
      },
    }),
    prisma.quotation.findMany({
      where:{
        vendorId : "65362fe43ee4ee234d73f4cc",
        status: QuotationStatus.ACCEPTED
      },
      include : {
        products :true
      },
      orderBy:{
        updatedAt: 'desc'
      },
    })
  ])
  
  if (quotationsWithSameQuotReq.length > 0) isVendorCanCreateQuotation = false;

  return (
    <>
    <QuotaionClient quotationRequest={quotationRequest} isVendor={true} isVendorCanCreateQuotation={isVendorCanCreateQuotation} activeQuotationsOfSameVendor={activeQuotationsOfSameVendor}/>
    </>
  )
}

export default page
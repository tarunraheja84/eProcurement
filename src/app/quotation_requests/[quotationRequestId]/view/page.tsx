import React from 'react'
import ViewQuotationRequest from '@/components/quotation_requests/ViewQuotationRequest';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;

  const quotationRequest= await prisma.quotationRequest.findUnique({ 
    where: {
      quotationRequestId
    },
    include: {
      products:true,
      procurement:true,
      vendors:true
    }
  });
 

  return (
    <>
      <ViewQuotationRequest quotationRequest={quotationRequest}/>
    </>
  )
}

export default page
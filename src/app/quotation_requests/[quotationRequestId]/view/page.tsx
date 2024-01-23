import React from 'react'
import ViewQuotationRequest from '@/components/quotation_requests/ViewQuotationRequest';

const page = async (context: any) => {
  const quotationRequestId = context.params.quotationRequestId;

  const [quotationRequest, correspondingQuotations]= await Promise.all([prisma.quotationRequest.findUnique({ 
    where: {
      quotationRequestId
    },
    include: {
      products:true,
      procurement:true,
      vendors:true
    }
  }),
  prisma.quotation.findMany({
    orderBy:{
      createdAt:'asc'
    },
    where: {
      quotationRequestId
    }
  })
  ]);
 
  let vendorIdQuotationsMap:any={};

  for(const quotation of correspondingQuotations){
    vendorIdQuotationsMap[quotation?.vendorId]= quotation;
  }
  return (
    <>
      <ViewQuotationRequest quotationRequest={quotationRequest} vendorIdQuotationsMap={vendorIdQuotationsMap}/>
    </>
  )
}

export default page
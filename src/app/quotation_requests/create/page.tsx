import { VendorStatus } from '@prisma/client';
import React from 'react'
import prisma from '@/lib/prisma';
import QuotationRequestForm from '@/components/quotation_requests/QuotationRequestForm';

const page = async (context:any) => {
  const vendorIdToBusinessNameMap =  await prisma.vendor.findMany({
    where: {
      status: VendorStatus.ACTIVE
    },
    select : {
      vendorId : true,
      businessName : true
    }
  });
  return (
    <>
      <QuotationRequestForm vendorIdToBusinessNameMap={vendorIdToBusinessNameMap} procurementId={context.searchParams.procurementId}/>
    </>
  )
}

export default page
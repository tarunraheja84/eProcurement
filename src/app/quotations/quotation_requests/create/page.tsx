import { Vendor, VendorStatus } from '@prisma/client';
import React from 'react'
import prisma from '@/lib/prisma';
import QuotationRequestForm from '@/components/quotationRequestForm';

const page = async () => {
  const vendors =  await prisma.vendor.findMany({
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
      <QuotationRequestForm isForUpdate={false} vendorIdToBusinessNameMap={vendors}/>
    </>
  )
}

export default page
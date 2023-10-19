import QuotationForm from '@/components/quotationForm'
import { Vendor } from '@prisma/client';
import React from 'react'
import prisma from '@/lib/prisma';

const page = async () => {
  const vendors =  await prisma.vendor.findMany()
  const vendorIdToBusinessNameMap = vendors.map((vendor : Vendor) => {
    return {vendorId:vendor.vendorId, businessName : vendor.businessName}
  });
  return (
    <>
      <QuotationForm isForUpdate={false} vendorIdToBusinessNameMap={vendorIdToBusinessNameMap}/>
    </>
  )
}

export default page
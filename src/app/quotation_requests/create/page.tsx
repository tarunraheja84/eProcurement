import { UserRole, VendorStatus } from '@prisma/client';
import React from 'react'
import prisma from '@/lib/prisma';
import QuotationRequestForm from '@/components/quotation_requests/QuotationRequestForm';
import { getUserSessionData } from '@/utils/utils';
import AccessDenied from '@/app/access_denied/page';

const page = async (context:any) => {
  const [vendorIdToBusinessNameMap, sessionData] =  await Promise.all([prisma.vendor.findMany({
    where: {
      status: VendorStatus.ACTIVE
    },
    select : {
      vendorId : true,
      businessName : true
    }
  }),getUserSessionData()]);
  return (
    <>
     {sessionData?.role === UserRole.MANAGER || sessionData?.role === UserRole.ADMIN ? <QuotationRequestForm vendorIdToBusinessNameMap={vendorIdToBusinessNameMap} procurementId={context.searchParams.procurementId}/> : <AccessDenied />}
    </>
  )
}

export default page
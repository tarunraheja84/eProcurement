import ViewProcurement from '@/components/procurements/ViewProcurement';
import { QuotationStatus } from '@prisma/client';
import React from 'react'

const page = async (context: any) => {
  const procurementId = context.params.procurementId;

  const [procurement, correspondingQuotations] = await Promise.all([
    prisma.procurement.findUnique({
      where: {
        procurementId: procurementId,
      },
      include: {
        products: true
      }
    }),
    prisma.quotation.findMany({
      where: {
        procurementId: procurementId,
        status:{
          in:[QuotationStatus.ACCEPTED, QuotationStatus.PENDING]
        }
      },
      include:{
        vendor:true
      }
    })
  ]);
  return (
    <>
      {procurement && <ViewProcurement procurement={procurement} correspondingQuotations={correspondingQuotations}/>}
    </>
  )
}

export default page

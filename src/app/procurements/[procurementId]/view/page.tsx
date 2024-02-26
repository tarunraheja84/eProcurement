import ViewProcurement from '@/components/procurements/ViewProcurement';
import React from 'react'

const page = async (context: any) => {
  const procurementId = context.params.procurementId;

  const procurement = await prisma.procurement.findUnique({
    where: {
      procurementId: procurementId,
    },
    include: {
      products: true
    }
  });

  return (
    <>
      {procurement && <ViewProcurement procurement={procurement} />}
    </>
  )
}

export default page

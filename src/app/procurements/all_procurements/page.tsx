import ProcurementsTable from '@/components/procurements/ProcurementsTable'
import React from 'react'
import prisma from '@/lib/prisma'
import { Procurement, ProcurementStatus } from '@prisma/client';
import { ProcurementsType } from '@/types/enums';

const page = async () => {
  let procurements: Procurement[] = [], numberOfProcurements: number = 0;

    const contextFilters = {
      NOT: {
        status: ProcurementStatus.DRAFT
      }
    };

    [procurements, numberOfProcurements] = await Promise.all([prisma.procurement.findMany({
      orderBy:{
        updatedAt: 'desc'
      },
      take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
      where: { ...contextFilters }
    }),
    prisma.procurement.count({
      where: { ...contextFilters }
    })
    ]);

  return (
    <>
    {<ProcurementsTable procurements={procurements} numberOfProcurements={numberOfProcurements} procurementType={ProcurementsType.ALL_PROCUREMENTS} />}
    </>
  )
}

export default page

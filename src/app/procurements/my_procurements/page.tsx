import ProcurementsTable from '@/components/procurements/ProcurementsTable'
import React from 'react'
import prisma from '@/lib/prisma'
import { Procurement } from '@prisma/client';
import { getUserEmail, getUserName } from '@/utils/utils';
import { ProcurementsType } from '@/types/enums';

const page = async () => {
  const [userEmailId, userName] = await Promise.all([getUserEmail(), getUserName()]);
  let procurements: Procurement[] = [], numberOfProcurements: number = 0;

    const contextFilters ={
      OR: [
        { createdBy: userEmailId! },
        { updatedBy: userEmailId! },
        { confirmedBy: userName! },
        { requestedTo: userName! }
      ]
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
    <ProcurementsTable procurements={procurements} numberOfProcurements={numberOfProcurements} procurementType={ProcurementsType.MY_PROCUREMENTS} />
  )
}

export default page

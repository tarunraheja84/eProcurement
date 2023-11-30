import ProcurementsTable from '@/components/ProcurementsTable'
import React from 'react'
import prisma from '@/lib/prisma'
import { Procurement, ProcurementStatus } from '@prisma/client';
import { getUserEmail, getUserName } from '@/utils/utils';

const page = async () => {
  const [userMail, userName] = await Promise.all([getUserEmail(), getUserName()]);
  let procurements: Procurement[] = [], numberOfProcurements: number = 0;

  if (userMail && userName) {
    const contextFilters ={
      OR: [
        { createdBy: userMail },
        { updatedBy: userMail },
        { confirmedBy: userName },
        { requestedTo: userName }
      ]
    };

    [procurements, numberOfProcurements] = await Promise.all([prisma.procurement.findMany({
      take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
      where: { ...contextFilters }
    }),
    prisma.procurement.count({
      where: { ...contextFilters }
    })
    ]);
  }
  return (
    <ProcurementsTable procurements={procurements} numberOfProcurements={numberOfProcurements} context={"my_procurements"} />
  )
}

export default page

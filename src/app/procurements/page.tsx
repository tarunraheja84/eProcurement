import ProcurementsTable from '@/components/ProcurementsTable'
import React from 'react'

const page = async (context:any) => {
  const procurements = await prisma.procurement.findMany();
  return (
      <>
      { procurements.length ?
      <ProcurementsTable procurements={procurements} context={context}/>
      :
    <div className='text-center'>No Procurements to display</div>
    }
    </>
  )
}

export default page

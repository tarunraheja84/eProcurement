import ProcurementsTable from '@/components/ProcurementsTable'
import ViewProcurement from '@/components/ViewProcurement';
import React from 'react'

const page = async (context:any) => {
  if(context.searchParams.q){
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
  else {
    const procurementId = context.searchParams.procurementId;
  
    const procurement=await prisma.procurement.findUnique({
      where: {
        procurementId:procurementId,
      },
      include:{
        products:true
      }
    });

  return (
    <>
      {procurement && <ViewProcurement procurement={procurement}/>}
    </>
  )
  }
}

export default page

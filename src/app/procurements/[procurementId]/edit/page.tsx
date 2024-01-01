import ProcurementForm from '@/components/procurements/ProcurementForm';
import prisma from '@/lib/prisma'

const page = async (context: any) => {
  const procurementId = context.params.procurementId;
  
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
      {procurement && <ProcurementForm procurement={procurement} context={context}/>}
    </>
  )
}

export default page
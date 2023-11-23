import EditProcurement from '@/components/ProcurementForm';
import prisma from '@/lib/prisma'

const page = async (context: any) => {
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
      {procurement && <EditProcurement procurement={procurement} context={context}/>}
    </>
  )
}

export default page
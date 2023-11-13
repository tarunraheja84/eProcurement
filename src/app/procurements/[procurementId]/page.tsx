import ViewProcurement from '@/components/viewProcurement';
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
      {procurement && <ViewProcurement procurement={procurement}/>}
    </>
  )
}

export default page

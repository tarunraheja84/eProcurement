import React from 'react'
import ViewQuotation from '@/components/quotations/ViewQuotation';
import { QuotationStatus } from '@prisma/client';

const page = async (context:any) => {
    const quotation = await prisma.quotation.findUnique({
        where: {
            quotationId: context.params.quotationId
        },
        include:{
            products:true
        }
    });

    let rejectionNote="";
    if(quotation?.status===QuotationStatus.REJECTED){
        const note=await prisma.note.findUnique({
            where:{
                entityId:context.params.quotationId
            }
        })
        rejectionNote=note?.message!;
    }

    return (
       <ViewQuotation quotation={quotation} rejectionNote={rejectionNote}/> 
    )
}

export default page
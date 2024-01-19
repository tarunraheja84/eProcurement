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

    const quotationRequest= await prisma.quotationRequest.findUnique({
        where: {
            quotationRequestId: quotation?.quotationRequestId
        },
        select:{
            createdBy:true
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
       <ViewQuotation quotation={quotation} quotationRequestSender={quotationRequest?.createdBy} rejectionNote={rejectionNote}/> 
    )
}

export default page
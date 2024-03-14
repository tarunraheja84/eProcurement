import React from 'react'
import prisma from '@/lib/prisma';
import ViewQuotation from '@/components/quotations/ViewQuotation';
import { QuotationStatus } from '@prisma/client';

const page = async (context:any) => {
    const vendorQuotations = await prisma.quotation.findMany({
        where: {
            vendorId: context.params.vendorId,
            quotationRequestId: context.searchParams.quotationRequestId
        },
        include:{
            products:true
        }
    });

    if(!vendorQuotations.length)
    return (
        <div className="w-full text-center">Vendor has not responded yet</div>
    )

    const quotationRequest= await prisma.quotationRequest.findUnique({
        where: {
            quotationRequestId: vendorQuotations[0]?.quotationRequestId
        },
        select:{
            createdBy:true
        }
    });

    let rejectionNote="";
    if(vendorQuotations[0]?.status===QuotationStatus.REJECTED){
        // If used Promise.all will give error as it will only exist in case of REJECTED
        const note=await prisma.note.findUnique({
            where:{
                entityId:context.params.quotationId
            }
        })
        rejectionNote=note?.message!;
    }

    return (
        <>
       {vendorQuotations.length>0 ? <ViewQuotation quotation={vendorQuotations[0]} quotationRequestSender={quotationRequest?.createdBy!} rejectionNote={rejectionNote}/> : <div className="w-full text-center">Vendor has not responded yet</div>}
       </>
    )
}

export default page
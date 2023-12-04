import prisma from '@/lib/prisma'
import TableHeader from "@/components/tableHeader";
import QuotationRequestsTable from '@/components/quotationRequestsTable';
import { QuotationRequestStatus } from '@prisma/client';

const page = async () => {
    const quotationRequests : any = await prisma.quotationRequest.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        where : {
            status : QuotationRequestStatus.ACTIVE
        },
        include : {
            vendors :true,
            procurement : true
        }
    });
    return (
        <div>
            <TableHeader heading="Quotation Requests" buttonText="Create New" route="/quotations/quotation_requests/create"/>
            <QuotationRequestsTable quotationRequests={quotationRequests}/>
        </div>
    )
}

export default page
import prisma from '@/lib/prisma'
import TableHeader from "@/components/tableHeader";
import QuotationsRequestTable from '@/components/quotationRequestsTable';
import { QuotationRequestStatus } from '@prisma/client';

const page = async () => {
    const quotationRequests : any = await prisma.quotationRequest.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        where : {
            status : QuotationRequestStatus.DRAFT
        },
        include : {
            vendors :true
        }
    });
    return (
        <div>
            <TableHeader heading="My Quotation" buttonText="Create New" route="/quotations/quotation_requests/create"/>
            <QuotationsRequestTable quotationRequests={quotationRequests}/>
        </div>
    )
}

export default page
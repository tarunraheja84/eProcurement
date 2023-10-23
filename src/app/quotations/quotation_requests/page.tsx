import prisma from '@/lib/prisma'
import TableHeader from "@/components/tableHeader";
import { QuotationRequest } from '@/types/quotationRequest';
import QuotationRequestsTable from '@/components/quotationRequestsTable';
import { QuotationRequestStatus } from '@/types/enums';

const page = async () => {
    const quotationRequests : QuotationRequest[] = await prisma.quotationRequest.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        where : {
            status : QuotationRequestStatus.ACTIVE
        },
        include : {
            vendors :true
        }
    });
    return (
        <div>
            <TableHeader heading="Quotation Requests" buttonText="Create New" route="/quotations/create"/>
            <QuotationRequestsTable quotationRequests={quotationRequests}/>
        </div>
    )
}

export default page
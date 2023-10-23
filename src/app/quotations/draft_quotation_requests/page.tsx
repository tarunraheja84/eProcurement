import prisma from '@/lib/prisma'
import TableHeader from "@/components/tableHeader";
import { QuotationRequest } from '@/types/quotationRequest';
import { QuotationRequestStatus } from '@/types/enums';
import QuotationsRequestTable from '@/components/quotationRequestsTable';

const page = async () => {
    const quotationRequests : QuotationRequest[] = await prisma.quotationRequest.findMany({
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
            <TableHeader heading="My Quotation" buttonText="Create New" route="/quotations/create"/>
            <QuotationsRequestTable quotationRequests={quotationRequests}/>
        </div>
    )
}

export default page
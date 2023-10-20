import prisma from '@/lib/prisma'
import QuotationRequestHistory from "./quotationsRequestHistory";
import TableHeader from "@/components/tableHeader";
import { QuotationRequest } from '@/types/quotationRequest';

const page = async () => {
    const quotationRequests : QuotationRequest[] = await prisma.quotationRequest.findMany({
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return (
        <div>
            <TableHeader heading="Quotation Request History" buttonText="Create New" route="/quotations/create"/>
            <QuotationRequestHistory quotationRequests={quotationRequests}/>
        </div>
    )
}

export default page
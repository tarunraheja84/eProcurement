import VendorsPageHeader from "@/components/vendorsPageHeader"
import prisma from '@/lib/prisma'
import { Quotation } from "@prisma/client";
import QuotationHistory from "./quotationsHistory";
import TableHeader from "@/components/tableHeader";

const page = async () => {
    const quotations: Quotation[] = await prisma.quotation.findMany({
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return (
        <div>
            <TableHeader heading="Quotation History" buttonText="Create New" route="/quotations/create"/>
            <QuotationHistory quotations={quotations}/>
        </div>
    )
}

export default page
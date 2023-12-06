import prisma from '@/lib/prisma'
import TableHeader from "@/components/tableHeader";
import QuotationRequestsTable from '@/components/quotationRequestsTable';
import { QuotationRequest, QuotationRequestStatus } from '@prisma/client';
import { getUserEmail, getUserName } from '@/utils/utils';
import {
    subDays,
    endOfDay,
} from 'date-fns';
import { QuotationRequestsType } from '@/types/enums';

const page = async () => {
    const today = new Date();
    const [userMail, userName] = await Promise.all([getUserEmail(), getUserName()]);
    let quotationRequests: QuotationRequest[] = [], noOfQuotationRequests: number = 0;

    if (userMail && userName) {
        const contextFilters = {
            NOT: {
                status: QuotationRequestStatus.DRAFT
            }
        };

        [quotationRequests, noOfQuotationRequests] = await Promise.all([prisma.quotationRequest.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
            include: {
                vendors: true,
                procurement: true
            },
            where: {
                createdAt: {
                    gte: subDays(today, 6),
                    lte: endOfDay(today)
                },
                status: QuotationRequestStatus.ACTIVE,
                ...contextFilters
            }
        }),
        prisma.quotationRequest.count({
            where: { createdAt: {
                gte: subDays(today, 6),
                lte: endOfDay(today)
            },
            status: QuotationRequestStatus.ACTIVE,
            ...contextFilters }
        })
        ]);
    }
    return (
        <div>
            <TableHeader heading="Quotation Requests" buttonText="Create New" route="/quotations/quotation_requests/create" />
            <QuotationRequestsTable quotationRequests={quotationRequests} noOfQuotationRequests={noOfQuotationRequests} context={QuotationRequestsType.all_quotations_requests}/>
        </div>
    )
}

export default page
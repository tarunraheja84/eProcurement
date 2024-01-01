import prisma from '@/lib/prisma'
import QuotationRequestsTable from '@/components/quotation_requests/QuotationRequestsTable';
import { QuotationRequest, QuotationRequestStatus } from '@prisma/client';
import {
    subDays,
    endOfDay,
} from 'date-fns';
import { QuotationRequestsType } from '@/types/enums';

const page = async () => {
    const today = new Date();
    let quotationRequests: QuotationRequest[] = [], noOfQuotationRequests: number = 0;

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
        
    return (
        <div>
            <QuotationRequestsTable quotationRequests={quotationRequests} noOfQuotationRequests={noOfQuotationRequests} context={QuotationRequestsType.ALL_QUOTATION_REQUESTS}/>
        </div>
    )
}

export default page
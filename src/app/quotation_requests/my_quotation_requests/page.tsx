import prisma from '@/lib/prisma'
import QuotationsRequestTable from '@/components/quotation_requests/QuotationRequestsTable';
import { QuotationRequest } from '@prisma/client';
import { getUserEmail } from '@/utils/utils';
import {
    subDays,
    endOfDay,
} from 'date-fns';
import { QuotationRequestsType } from '@/types/enums';

const page = async () => {
    const today = new Date();
    const userEmailId = await getUserEmail();
    let quotationRequests: QuotationRequest[] = [], noOfQuotationRequests: number = 0;

      const contextFilters = {
        OR: [
            { createdBy: userEmailId! },
            { updatedBy: userEmailId! }
        ]
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
                ...contextFilters
            }
        }),
        prisma.quotationRequest.count({
            where: { createdAt: {
                gte: subDays(today, 6),
                lte: endOfDay(today)
            },
            ...contextFilters }
        })
        ]);
        
    return (
            <QuotationsRequestTable quotationRequests={quotationRequests} noOfQuotationRequests={noOfQuotationRequests} quotationRequestType={QuotationRequestsType.MY_QUOTATION_REQUESTS}/>
    )
}

export default page
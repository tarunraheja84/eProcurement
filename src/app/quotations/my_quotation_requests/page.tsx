import prisma from '@/lib/prisma'
import { QuotationRequest } from '@prisma/client';
import { getUserEmail } from '@/utils/utils';

import { QuotationRequestsType } from '@/types/enums';
import QuotationRequestsTable from '@/components/quotation_requests/QuotationRequestsTable';

const page = async () => {
    const today = new Date();
    const userMail = await getUserEmail();
    let quotationRequests: QuotationRequest[] = [], noOfQuotationRequests: number = 0;

      const contextFilters = {
        OR: [
            { createdBy: userMail! },
            { updatedBy: userMail! }
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
                ...contextFilters
            }
        }),
        prisma.quotationRequest.count({
            where: { 
            ...contextFilters }
        })
        ]);
        
    return (
        <div>
            <QuotationRequestsTable quotationRequests={quotationRequests} noOfQuotationRequests={noOfQuotationRequests} quotationRequestType={QuotationRequestsType.MY_QUOTATION_REQUESTS}/>
        </div>
    )
}

export default page
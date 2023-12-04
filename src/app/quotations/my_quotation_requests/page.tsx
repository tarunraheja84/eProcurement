import prisma from '@/lib/prisma'
import TableHeader from "@/components/tableHeader";
import QuotationsRequestTable from '@/components/quotationRequestsTable';
import { QuotationRequest, QuotationRequestStatus } from '@prisma/client';
import { getUserEmail, getUserName } from '@/utils/utils';
import {
    subDays,
    endOfDay,
} from 'date-fns';

const page = async () => {
  const today = new Date();
    const [userMail, userName] = await Promise.all([getUserEmail(), getUserName()]);
    let quotationRequests: QuotationRequest[] = [], noOfQuotationRequests: number = 0;

    if (userMail && userName) {
      const contextFilters = {
        OR: [
            { createdBy: userMail },
            { updatedBy: userMail }
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
    }
    return (
        <div>
            <TableHeader heading="My Quotation Requests" buttonText="Create New" route="/quotations/quotation_requests/create"/>
            <QuotationsRequestTable quotationRequests={quotationRequests} noOfQuotationRequests={noOfQuotationRequests} context={"my_quotation_requests"}/>
        </div>
    )
}

export default page
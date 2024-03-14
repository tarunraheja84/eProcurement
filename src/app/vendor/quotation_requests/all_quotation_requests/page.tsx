import prisma from '@/lib/prisma'
import QuotationRequestsTable from '@/components/quotation_requests/QuotationRequestsTable';
import { QuotationRequestStatus } from '@prisma/client';
import { QuotationRequestsType } from '@/types/enums';
import { cookies } from 'next/headers';

const page = async () => {
    const today = new Date();
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value

    const acceptedQuotationRequests= await prisma.quotation.findMany({
        where: {
            vendorId: vendorId
        },
        select:{
            quotationRequestId:true
        }
    })

    const acceptedQuotationRequestIds= acceptedQuotationRequests.map((acceptedQuotationRequest)=>acceptedQuotationRequest.quotationRequestId);

    const [quotationRequests, noOfQuotationRequests] = await Promise.all([prisma.quotationRequest.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        include: {
            vendors: true,
            procurement: true
        },
        where: {
            vendorIds: {
                has: vendorId
            },
            status:QuotationRequestStatus.ACTIVE,
            quotationRequestId:{
                notIn:acceptedQuotationRequestIds
            }
        }
    }),
    prisma.quotationRequest.count({
        where: {
            vendorIds: {
                has: vendorId
            },
            status:QuotationRequestStatus.ACTIVE,
            quotationRequestId:{
                notIn:acceptedQuotationRequestIds
            }
        }
    })
    ]);

    return (
        <div>
            <QuotationRequestsTable quotationRequests={quotationRequests} noOfQuotationRequests={noOfQuotationRequests} quotationRequestType={QuotationRequestsType.ALL_QUOTATION_REQUESTS} />
        </div>
    )
}

export default page
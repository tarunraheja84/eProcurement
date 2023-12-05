import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, QuotationRequestStatus } from "@prisma/client";
import { getUserEmail, getUserName } from "@/utils/utils";

export const POST = async (req: NextRequest) => {

    const where: Prisma.QuotationRequestWhereInput = {};
    try {
        const { page, startDate, endDate, status, q, count } = await req.json();
        const [userMail, userName] = await Promise.all([getUserEmail(), getUserName()]);

        if (userMail && userName) {
            const contextFilters = q === "my_quotation_requests" ? {
                OR: [
                    { createdBy: userMail },
                    { updatedBy: userMail }
                ]
            } : {
                NOT: {
                    status: QuotationRequestStatus.DRAFT
                }
            }

            if (startDate && endDate && status) {
                where.createdAt = {
                    gte: startDate,
                    lte: endDate
                };
                where.status = status;
            }
            else if (startDate && endDate) {
                where.createdAt = {
                    gte: startDate,
                    lte: endDate
                };
            }
            else if (status) {
                where.status = status;
            }


            if (count) {
                const count = await prisma.quotationRequest.count({
                    where: {
                        ...where,
                        ...contextFilters
                    }
                })
                return NextResponse.json({ count });
            }
            else {
                const result = await prisma.quotationRequest.findMany({
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    include: {
                        vendors: true,
                        procurement: true
                    },
                    skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                    where: {
                        ...where,
                        ...contextFilters
                    }
                })
                return NextResponse.json(result);
            }
        }
    }
    catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({ error: error, status: statusCode });
    }
}

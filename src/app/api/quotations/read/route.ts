import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export const POST = async (req: NextRequest) => {

    const where: Prisma.QuotationWhereInput = {};
    try {
        const { page, startDate, endDate, status, count } = await req.json();
        
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }
            
            if (status) {
                where.status = status;
            }


            if (count) {
                const count = await prisma.quotation.count({where})
                return NextResponse.json({ count });
            }
            else {
                const result = await prisma.quotation.findMany({
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    include: {
                        vendor: true,
                        procurement: true
                    },
                    skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                    where: {
                        ...where,
                    }
                })
                return NextResponse.json(result);
            }
    }
    catch (error: any) {
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({ error: error, status: statusCode });
    }
}

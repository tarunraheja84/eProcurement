import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, Quotation } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { QuotationStatus } from "@/types/enums";

export const POST = async (request: NextRequest) => {
    try {
        let { startDate, endDate, status }: any = await request.json();
        const where: Prisma.QuotationWhereInput = {};
        if (status) {
            where.status = status as QuotationStatus;
        }
        
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }
        const quotations: Quotation[] = await prisma.quotation.findMany({
            where: where,
            include : {
                vendor :true,
                procurement :true
            }
        });
        return NextResponse.json(quotations);

    } catch (error: any) {
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};


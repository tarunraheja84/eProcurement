import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, Quotation } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { QuotationStatus } from "@/types/enums";

export const POST = async (request: NextRequest) => {
    try {
        let quotation: any = await request.json();
        const userEmailId = await getUserEmail()
        quotation.createdBy = userEmailId!;
        quotation.updatedBy = userEmailId!;
        await prisma.quotation.create({
            data: quotation
        });
        return NextResponse.json({ status: "success" });

    } catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};


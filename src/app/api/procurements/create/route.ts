import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const result = await prisma.procurement.create({ data: body.procurementPlan });
        // const res = await prisma.product.create({ data: body.procurementPlan });
        // return NextResponse.json({res,result});

    } catch (error: any) {
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

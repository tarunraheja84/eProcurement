import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Order, Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const [order, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        order.createdBy = userEmailId ?? "";
        order.updatedBy = userEmailId ?? "";
        const result = await prisma.order.create({ data: order });
        return NextResponse.json(result);

    } catch (error: any) {
        console.log('error :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

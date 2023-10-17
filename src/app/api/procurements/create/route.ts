import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
interface Data {
    name: string
}
export const POST = async (request: NextRequest) => {
    try {
        const procurementData: Data = await request.json();
        const result = await prisma.procurement.create({ data: procurementData });
        return NextResponse.json(result);

    } catch (error: any) {
        let statusCode = 500; // Default to Internal Server Error

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma errors with appropriate status codes
            if (error.code === 'P2002') {
                statusCode = 400; // Bad Request
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

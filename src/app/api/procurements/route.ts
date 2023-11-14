import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, ProcurementStatus } from "@prisma/client";
interface Data {
    name: string
}
export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const procurementId: string | null = searchParams ? searchParams.get("procurementId") : null;
        if (procurementId) {
            const procurement =  await prisma.procurement.findUnique({
                where : {
                    procurementId : procurementId,
                },
                include : {
                    products : true
                }
            })
            return NextResponse.json(procurement);
        }
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

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const page: number | null = searchParams ? Number(searchParams.get("page")) : null;
        const result = await prisma.product.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page! - 1),
            take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        });
        return NextResponse.json(result);

    } catch (error: any) {
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new NextResponse(error.message, { status: statusCode });
    }
};

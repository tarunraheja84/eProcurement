import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const sellerOrderId: string | null = searchParams ? searchParams.get("sellerOrderId") : null;
        const purchaseOrders = await prisma.order.findMany({
            where : {
                marketPlaceOrderId : sellerOrderId!
            },
        })
        return NextResponse.json({purchaseOrders});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

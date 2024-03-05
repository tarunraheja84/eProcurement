import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const POST = async (request: NextRequest) => {
    try {
        const {sellerOrderId} = await request.json();
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

import { SellerOrder } from "@/types/sellerOrder";
import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

interface Data {
    sellerOrderId: string;
}
export const POST = async (request: NextRequest) => {
    try {
        const data: Data = await request.json(); 
        const sellerOrderId = data.sellerOrderId
        const purchaseOrders = await prisma.order.findMany({
            where : {
                marketPlaceOrderId : sellerOrderId
            }
        })
        return NextResponse.json({purchaseOrders});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

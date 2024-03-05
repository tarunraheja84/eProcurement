import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const {sellerOrderId} = await request.json();
        const result = await axios.post(`${process.env.FB_FUNCTION_BASE_URL}orderService-getSellerOrdersReqCall`, {sellerOrderId},{})
        return NextResponse.json({sellerOrders : result.data.sellerOrders});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

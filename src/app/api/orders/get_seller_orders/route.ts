import { SellerOrder } from "@/types/sellerOrder";
import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
interface Data {
    sellerOrderId: string;
}
export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const sellerOrderId: string | null = searchParams ? searchParams.get("sellerOrderId") : null;
        const result = await axios.post(`${process.env.FB_FUNCTION_BASE_URL}orderService-getSellerOrdersReqCall`, {sellerOrderId},{})
        return NextResponse.json({sellerOrders : result.data.sellerOrders});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

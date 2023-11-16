import { SellerOrder } from "@/types/sellerOrder";
import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
interface Data {
    sellerOrderId: string;
}
export const POST = async (request: NextRequest) => {
    try {
        const data: Data = await request.json();
        const sellerOrderId = data.sellerOrderId
        const result = await axios.post(`https://asia-south1-flavr-fb.cloudfunctions.net/orderService-getSellerOrdersReqCall/payments-createCXOTransactionApiCall`, {sellerOrderId},{})
        return NextResponse.json({sellerOrders : result.data.sellerOrders});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

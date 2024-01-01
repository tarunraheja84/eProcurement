import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
interface Data {
    sellerOrderId: string;
}
export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const buyerId: string | null = searchParams ? searchParams.get("buyerId") : null;
        const result = await axios.post(`https://buyerservicegen2-getbuyergen2-ph35j7k57a-el.a.run.app`, {buyerId},{})
        return NextResponse.json({buyer : result.data});
    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

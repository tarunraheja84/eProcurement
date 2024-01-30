import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cloudFunctionsUrl } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const {productIds} = await request.json()
        const result = await axios.post(cloudFunctionsUrl.getSellerProductsByProdu, {sellerProductIds : productIds},{})
        return NextResponse.json(result.data);

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

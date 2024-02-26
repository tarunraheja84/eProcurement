import { cloudFunctionsUrl } from "@/utils/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const buyerId: string | null = searchParams ? searchParams.get("buyerId") : null;
        const result = await axios.post(cloudFunctionsUrl.getBuyer, {buyerId},{})
        return NextResponse.json({buyer : result.data});
    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

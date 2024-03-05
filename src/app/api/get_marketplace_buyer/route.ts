import { cloudFunctionsUrl } from "@/utils/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const {buyerId} = await request.json();
        const result = await axios.post(cloudFunctionsUrl.getBuyer, {buyerId},{})
        return NextResponse.json({buyer : result.data});
    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

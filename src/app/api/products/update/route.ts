import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getUserEmail } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const sellerProductId: string | null = searchParams ? searchParams.get("sellerProductId") : null;
        let [productData, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        productData.updatedBy = userEmailId!;
        const product = await prisma.product.updateMany({
            where :{
                sellerProductId : sellerProductId!
            },
            data : productData
        })
        return NextResponse.json({product});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

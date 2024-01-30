import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const productId: string | null = searchParams ? searchParams.get("productId") : null;
        const marketPlaceProductId: string | null = searchParams ? searchParams.get("marketPlaceProductId") : null;
        let where :any  = {}
        if (productId) where.id = productId;
        if (marketPlaceProductId) where.productId = marketPlaceProductId;
        const product = await prisma.product.findFirst({
            where
        })
        return NextResponse.json({product});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

import { SellerOrder } from "@/types/sellerOrder";
import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getUserEmail } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const productId: string | null = searchParams ? searchParams.get("productId") : null;
        let [productData, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        productData.updatedBy = userEmailId!;
        const product = await prisma.product.update({
            where :{
                id : productId!
            },
            data : productData
        })
        return NextResponse.json({product});

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

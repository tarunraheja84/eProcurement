import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const {sellerProductId, isBasePriceFilter, page, count} = await request.json();
        let where :Prisma.ProductWhereInput  = {};

        if(sellerProductId) where.sellerProductId = sellerProductId;
        if(isBasePriceFilter) where.isBasePrice = isBasePriceFilter === "custom" ? false : true;

        if(count){
            const totalCount = await prisma.product.findMany({
                where:where,
                distinct: ['sellerProductId']
            })
            return NextResponse.json({count:totalCount.length});
        }
        else if(page){
            const products = await prisma.product.findMany({
                orderBy: {
                    updatedAt: 'desc'
                  },
                distinct: ['sellerProductId'],
                skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                where: where
            })
            return NextResponse.json(products);
        }
        else{
            const products = await prisma.product.findMany({
                orderBy: {
                    updatedAt: 'desc'
                  },
                where:where
            })
            return NextResponse.json(products);
        }

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

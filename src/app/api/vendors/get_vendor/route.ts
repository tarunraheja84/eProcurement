import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const GET = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const vendorId: string | null = searchParams ? searchParams.get("vendorId") : null;
        const vendor = await prisma.vendor.findFirst({
            where : {
                vendorId : vendorId!
            },
        })
        return NextResponse.json(vendor);

    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

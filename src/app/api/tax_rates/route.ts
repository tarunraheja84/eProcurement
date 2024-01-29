import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Order, Prisma } from "@prisma/client";
import { cloudFunctionsUrl, getUserEmail } from "@/utils/utils";
import axios from "axios";

export const POST = async (request: NextRequest) => {
    try {
        const productIds: {"productIds" : string[]} = await request.json();
        const result = await axios.post(cloudFunctionsUrl.getGstRatesUrl, productIds);
        return NextResponse.json(result.data);

    } catch (error: any) {
        console.log('error :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

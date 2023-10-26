import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export const GET = async () => {
    try {
        const result=await prisma.product.findMany()
        return Response.json(result)

    } catch (error: any) {
        console.log(error.message)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new NextResponse(error.message, { status: statusCode });
    }
};

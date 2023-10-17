import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
interface Data {
    name?: string,
    email: string
}

export const POST = async (request: NextRequest) => {

    try {
        const userData: Data = await request.json();
        const result = await prisma.user.create({ data: userData });
        return NextResponse.json(result);

    } catch (error: any) {
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

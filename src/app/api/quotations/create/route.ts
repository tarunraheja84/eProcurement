import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const [quotation, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        quotation.createdBy = userEmailId!;
        quotation.updatedBy = userEmailId!;
        await prisma.quotation.create({
            data: quotation
        });
        return NextResponse.json({ message: "success" });

    } catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};


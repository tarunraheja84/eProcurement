import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, UserRole, UserStatus } from "@prisma/client";


export const POST = async (request: NextRequest) => {
    const {status, role, page, countParam, vendorId} = await request.json();

    try {
        const where: Prisma.InternalUserWhereInput = {};

        if (status) {
            where.status = status;
        }
       
        if (role) {
            where.role = role;
        }

        if (countParam) {
            const count = await prisma.internalUser.count({
                where: where
            });
            return NextResponse.json({ count });
        }
        else if(page){
            const result = await prisma.internalUser.findMany({
                orderBy:{
                    updatedAt: 'desc'
                  },
                skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                where: where
            });
            return NextResponse.json(result);
        }
        else{
            const result = await prisma.internalUser.findMany({
                orderBy:{
                    updatedAt: 'desc'
                  },
                where:where
            });
            return NextResponse.json(result);
        }
    }
    catch (error: any) {
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({ error: error, status: statusCode });
    }
}
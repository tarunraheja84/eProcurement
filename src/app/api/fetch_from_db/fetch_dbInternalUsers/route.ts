import {  NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { InternalUserStatus, Prisma, UserRole } from "@prisma/client";

export const GET = async () => {
    try {
        const managers=await prisma.internalUser.findMany({
            where:{
                role:UserRole.MANAGER,
                status:InternalUserStatus.ACTIVE
            },
        })
        return Response.json(managers)

    } catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new NextResponse(error.message, { status: statusCode });
    }
};

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { InternalUser, Prisma } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const userData: InternalUser = await request.json();
        const result = await prisma.internalUser.create({
            data:userData
        });
        return NextResponse.json(result);

    } catch (error: any) {
        let statusCode = 500;
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({error: error,  status: statusCode });
    }
};

export const PUT = async (request: NextRequest) => {
    try {
        const {userData,userId} = await request.json();
        delete userData.userId;
        const result = await prisma.internalUser.update({
            where:{
                userId:userId
            },
            data:userData
        });
        return NextResponse.json(result);
    } catch (error: any) {
        let statusCode = 500;
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }
        return NextResponse.json({error: error,  status: statusCode });
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams;
        const result = await prisma.internalUser.delete({where: { userId: searchParams.get("userId")! }});
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

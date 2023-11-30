import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { InternalUser, UserStatus, Prisma, UserRole } from "@prisma/client";

export const GET = async (request: NextRequest) => {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;

    const status: UserStatus | null = searchParams.get("status") as UserStatus;
    const role: UserRole | null = searchParams.get("role") as UserRole;
    const page: number | null = Number(searchParams.get("page"));
    const countParam = searchParams.get("count");

    try {
        const where: Prisma.InternalUserWhereInput = {};

        if (status && role) {
            where.status = status;
            where.role = role;
        }
        else if (status) {
            where.status = status;
        }
        else if (role) {
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
                skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                where: where
            });
            return NextResponse.json(result);
        }
        else{
            const result = await prisma.internalUser.findMany({
                where:where
            });
            return NextResponse.json(result);
        }
    }
    catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({ error: error, status: statusCode });
    }
}

export const POST = async (request: NextRequest) => {
    try {
        const userData: InternalUser = await request.json();
        const result = await prisma.internalUser.create({
            data: userData
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

        return NextResponse.json({ error: error, status: statusCode });
    }
};

export const PUT = async (request: NextRequest) => {
    try {
        const { userData, userId } = await request.json();
        delete userData.userId;
        const result = await prisma.internalUser.update({
            where: {
                userId: userId
            },
            data: userData
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
        return NextResponse.json({ error: error, status: statusCode });
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams;
        const result = await prisma.internalUser.delete({ where: { userId: searchParams.get("userId")! } });
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

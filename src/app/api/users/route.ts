import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { InternalUser, UserStatus, Prisma, UserRole } from "@prisma/client";

export const GET = async (request: NextRequest) => {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;

    const statusParam = searchParams.get("status");
    const roleParam = searchParams.get("role");
    const pageParam = searchParams.get("page");
    const countParam = searchParams.get("count");

    try {

        if (statusParam && roleParam && pageParam) {
            const status: UserStatus | null = statusParam as UserStatus;
            const page: number | null = Number(pageParam);
            const role: UserRole | null = roleParam as UserRole;

            const result = await prisma.internalUser.findMany({
                skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                where: {
                    status: status,
                    role: role
                },
            });
            return NextResponse.json(result);
        }
        else if (statusParam && pageParam) {
            const status: UserStatus | null = statusParam as UserStatus;
            const page: number | null = Number(pageParam);

            if (Object.values(UserStatus).includes(status)) {
                const result = await prisma.internalUser.findMany({
                    skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                    where: {
                        status: status,
                    },
                });
                return NextResponse.json(result);
            }
        }
        else if (roleParam && pageParam) {
            const page: number | null = Number(pageParam);
            const role: UserRole | null = roleParam as UserRole;

            const result = await prisma.internalUser.findMany({
                skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                where: {
                    role: role,
                },
            });
            return NextResponse.json(result);
        }
        else if (pageParam) {
            const page: number | null = Number(pageParam);
            const result = await prisma.internalUser.findMany({
                skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)
            });
            return NextResponse.json(result);
        }
        else if (statusParam && roleParam && countParam) {
            const status: UserStatus | null = statusParam as UserStatus;
            const role: UserRole | null = roleParam as UserRole;
            const count = await prisma.internalUser.count({
                where: {
                    status: status,
                    role: role
                }
            });
            return NextResponse.json({ count });
        }
        else if (statusParam && countParam) {
            const status: UserStatus | null = statusParam as UserStatus;
            const count = await prisma.internalUser.count({
                where: {
                    status: status
                }
            });
            return NextResponse.json({ count });
        }
        else if (roleParam && countParam) {
            const role: UserRole | null = roleParam as UserRole;
            const count = await prisma.internalUser.count({
                where: {
                    role: role
                }
            });
            return NextResponse.json({ count });
        }
        else if (countParam) {
            const count = await prisma.internalUser.count();
            return NextResponse.json({ count });
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

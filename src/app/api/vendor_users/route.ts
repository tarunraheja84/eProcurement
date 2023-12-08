import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, UserRole, UserStatus, VendorUser } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const GET = async (request: NextRequest) => {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;

    const status: UserStatus | null = searchParams.get("status") as UserStatus;
    const role: UserRole | null = searchParams.get("role") as UserRole;
    const page: number | null = Number(searchParams.get("page"));
    const countParam = searchParams.get("count");

    try {
        const where: Prisma.VendorUserWhereInput = {};

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
            const count = await prisma.vendorUser.count({
                where: where
            });
            return NextResponse.json({ count });
        }
        else if(page){
            const result = await prisma.vendorUser.findMany({
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
            const result = await prisma.vendorUser.findMany({
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

export const POST = async (request: NextRequest) => {
    try {
        const [userData, userEmail] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const result = await prisma.vendorUser.create({ data: {name: userData.name, email: userData.email, phoneNumber: `+91${userData.phoneNumber}`, role: userData.role, vendorId: userData.vendorId, createdBy: userEmail!, updatedBy: userEmail! } });
        return NextResponse.json(result);

    } catch (error: any) {
        let statusCode = 500;
        console.log('error  :>> ', error);
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
        const [userData, userEmail] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const searchParams: URLSearchParams = request.nextUrl.searchParams;
        const result = await prisma.vendorUser.update({where: { userId: searchParams.get("userId") || "" }, data: {name: userData.name, email: userData.email, phoneNumber: `+91${userData.phoneNumber}`, role: userData.role, updatedBy: userEmail!} });
        return NextResponse.json(result);
    } catch (error: any) {
        let statusCode = 500;
        console.log('error  :>> ', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }
        return NextResponse.json({ error: error, status: statusCode });
    }
};

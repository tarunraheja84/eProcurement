import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, VendorUser } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

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
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }
        return new Response(error.message, { status: statusCode });
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        const searchParams: URLSearchParams = request.nextUrl.searchParams;
        const result = await prisma.vendorUser.delete({where: { userId: searchParams.get("userId") || "" }});
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

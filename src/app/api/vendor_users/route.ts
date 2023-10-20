import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, VendorUser } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const userData: VendorUser = await request.json();
        const result = await prisma.vendorUser.create({ data: {name: userData.name, email: userData.email, phoneNumber: `+91${userData.phoneNumber}`, role: userData.role, vendorId: userData.vendorId, createdBy: userData.createdBy, updatedBy: userData.updatedBy } });
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
        const userData: VendorUser = await request.json();
        const searchParams: URLSearchParams = request.nextUrl.searchParams;
        const result = await prisma.vendorUser.update({where: { userId: searchParams.get("userId") || "" }, data: {name: userData.name, email: userData.email, phoneNumber: userData.phoneNumber, role: userData.role} });
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

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, Vendor } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const vendorData: Vendor = await request.json();
        const userEmailId = await getUserEmail();
        const result = await prisma.vendor.create({ data: {businessName: vendorData.businessName, businessBrandName: vendorData.businessBrandName, gstin: vendorData.gstin, pan: vendorData.pan, addressLine: vendorData.addressLine, city: vendorData.city, state: vendorData.state, pinCode: vendorData.pinCode, phoneNumber: `+91${vendorData.phoneNumber}`, countryCode: vendorData.countryCode, status: vendorData.status, createdBy: userEmailId ?? "", updatedBy: userEmailId ?? "" } });
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
        const vendorData: Vendor = await request.json();
        const userEmailId = await getUserEmail();
        const searchParams: URLSearchParams = request.nextUrl.searchParams
        const result = await prisma.vendor.update({where: { vendorId: searchParams.get("vendorId") || "" }, data: {businessBrandName: vendorData.businessBrandName, gstin: vendorData.gstin, addressLine: vendorData.addressLine, city: vendorData.city, state: vendorData.state, pinCode: vendorData.pinCode, phoneNumber: vendorData.phoneNumber, updatedBy : userEmailId ?? ""} });
        return NextResponse.json({});
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

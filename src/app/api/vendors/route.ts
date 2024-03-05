import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

// export const GET = async (request: NextRequest) => {
//     try {
//         const searchParams: URLSearchParams = request.nextUrl.searchParams
//         const vendorId: string | null = searchParams ? searchParams.get("vendorId") : null;
//         const vendor = await prisma.vendor.findFirst({
//             where : {
//                 vendorId : vendorId!
//             },
//         })
//         return NextResponse.json(vendor);

//     } catch (error: any) {
//         console.log('error :>> ', error);
//         return new Response(error.message, { status: error.statusCode });
//     }
// };

export const POST = async (request: NextRequest) => {
    try {
        const [vendorData, userEmail] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const result = await prisma.vendor.create({ data: {businessName: vendorData.businessName, businessBrandName: vendorData.businessBrandName, gstin: vendorData.gstin, pan: vendorData.pan, addressLine: vendorData.addressLine, city: vendorData.city, state: vendorData.state, pinCode: vendorData.pinCode, phoneNumber: vendorData.phoneNumber, countryCode: vendorData.countryCode, status: vendorData.status, createdBy: userEmail!, updatedBy: userEmail! } });
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
        const [{vendorData, vendorId}, userEmail] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        console.log(vendorData, vendorId)
        const result = await prisma.vendor.update({where: { vendorId: vendorId || "" }, data: {businessBrandName: vendorData.businessBrandName, gstin: vendorData.gstin, addressLine: vendorData.addressLine, city: vendorData.city, state: vendorData.state, pinCode: vendorData.pinCode, phoneNumber: vendorData.phoneNumber, updatedBy: userEmail!} });
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

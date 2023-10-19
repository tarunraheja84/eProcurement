import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, Quotation } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { QuotationStatus } from "@/types/enums";
interface Data {
    quotation : Quotation,
    vendorsIdList : string[]
}
export const POST = async (request: NextRequest) => {
    try {
        const reqData :Data = await request.json();
        const {quotation, vendorsIdList} = reqData;
        const userEmailId = await getUserEmail()
        const createVendorRecord = async (vendorId :string) => {
            return prisma.quotation.create({
              data: {
                quotationName: quotation.quotationName,
                status: QuotationStatus.PENDING,
                createdBy: userEmailId ?? "",
                updatedBy: userEmailId ?? "",
                vendorId: vendorId,
                procurementId: quotation.procurementId,
              }
            });
        };
        await Promise.all(vendorsIdList.map(createVendorRecord));
        return NextResponse.json({status : "success"});

    } catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};


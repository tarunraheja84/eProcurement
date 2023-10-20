import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, QuotationRequest } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { QuotationRequestStatus } from "@/types/enums";
interface Data {
    quotationReq: QuotationRequest,
    vendorsIdList: string[]
}
export const POST = async (request: NextRequest) => {
    try {
        const reqData: Data = await request.json();
        const { quotationReq, vendorsIdList } = reqData;
        const userEmailId = await getUserEmail()
        await prisma.quotationRequest.create({
            data: {
                quotationRequestName: quotationReq.quotationRequestName,
                status: quotationReq.status as QuotationRequestStatus,
                createdBy: userEmailId ?? "",
                updatedBy: userEmailId ?? "",
                procurementId: quotationReq.procurementId,
                expiryDate: quotationReq.expiryDate,
                vendorIds :vendorsIdList
            }
        });
        return NextResponse.json({ status: "success" });

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


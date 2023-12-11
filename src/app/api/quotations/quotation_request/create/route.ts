import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, QuotationRequest, QuotationRequestStatus } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
interface Data {
    quotationReq: QuotationRequest,
    vendorsIdList: string[]
}
export const POST = async (request: NextRequest) => {
    try {
        const [reqData, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const { quotationReq, vendorsIdList } = reqData;
        await prisma.quotationRequest.create({
            data: {
                quotationRequestName: quotationReq.quotationRequestName,
                status: quotationReq.status as QuotationRequestStatus,
                createdBy: userEmailId!,
                updatedBy: userEmailId!,
                procurementId: quotationReq.procurementId,
                expiryDate: quotationReq.expiryDate,
                vendorIds :vendorsIdList,
                quotationRequestProducts : quotationReq.quotationRequestProducts!,
                productIds : quotationReq.productIds,
            }
        });
        return NextResponse.json({ message: "success" });

    } catch (error: any) {
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};


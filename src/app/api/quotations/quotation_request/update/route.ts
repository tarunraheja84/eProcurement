import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
interface Data {
    quotationReq: any,//TODO: remove this any
    quotationRequestId: string
}
export const PUT = async (request: NextRequest) => {
    try {
        const [reqData, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const { quotationReq, quotationRequestId } = reqData;

        quotationReq.updatedAt = new Date();
        quotationReq.updatedBy = userEmailId;
        delete quotationReq.quotationRequestId;
        const result = await prisma.quotationRequest.findUnique({
            where : {
                quotationRequestId : quotationRequestId
            }
        })
        if (result) {
            await prisma.quotationRequest.update({
                where :{
                    quotationRequestId : quotationRequestId
                },
                data : quotationReq
            })        
        }
        return NextResponse.json({ message: 'success' }, { status: 201 })

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


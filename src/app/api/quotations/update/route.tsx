import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from '@/lib/prisma';
import { getUserEmail } from "@/utils/utils";

export const PUT = async (request: NextRequest) => {
    try {
        const [jsonBody, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const {quotation, quotationId} = jsonBody; 
        quotation.updatedBy =userEmailId
        
            await prisma.quotation.update({
                where :{
                    quotationId : quotationId
                },
                data : quotation
            })        
        
        return NextResponse.json({ message: 'success' }, { status: 201 })
    } catch (error: any) {
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({ message: error.message }, { status: statusCode });
    }
}
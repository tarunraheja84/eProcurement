import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { Quotation } from "@/types/quotation";

export const POST = async (request: NextRequest) => {
    try {
        const jsonBody = await request.json();
        const {quotation, quotationId} : any = jsonBody; //TODO: remove this any
        delete quotation.quotationId;
        const result = await prisma.quotation.findUnique({
            where : {
                quotationId : quotationId
            }
        })
        if (result) {
            await prisma.quotation.update({
                where :{
                    quotationId : quotationId
                },
                data : quotation
            })        
        }
        return NextResponse.json({ message: 'success' }, { status: 201 })
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
}
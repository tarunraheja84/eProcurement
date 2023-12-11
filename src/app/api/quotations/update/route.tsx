import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const PUT = async (request: NextRequest) => {
    try {
        const [jsonBody, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const {quotation, quotationId} : any = jsonBody; //TODO: remove this any
        delete quotation.quotationId;
        quotation.updatedAt = new Date()
        quotation.updatedBy =userEmailId
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
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
}

export const PATCH = async (request: NextRequest) => {
    try {
        const [jsonBody, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const {data, quotationId} = jsonBody; 

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
                data : {
                    updatedAt: new Date(),
                    updatedBy: userEmailId,
                    ...data
                }
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
}
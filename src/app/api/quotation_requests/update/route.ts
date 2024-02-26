import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const PUT = async (request: NextRequest) => {
    try {
        const [reqData, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const { quotationReq, quotationRequestId } = reqData;

        quotationReq.updatedBy = userEmailId; 
        
        const products= await prisma.product.findMany({
            where:{
                id:{
                    in:quotationReq.productIds
                }
            },
            select:{
                id:true,
                sellerProductId:true
            }
        })

        const productsMap:any={};
        for(const product of products){
            productsMap[product.id]=product.sellerProductId;
        }

        const productIds= quotationReq.productIds.filter((productId:string)=> quotationReq.quotationRequestProducts.hasOwnProperty(productsMap[productId]));

        await prisma.quotationRequest.update({
            where :{
                quotationRequestId : quotationRequestId
            },
            data : quotationReq
        })  
        
        quotationReq.productIds=productIds;
        
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
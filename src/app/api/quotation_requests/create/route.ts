import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, QuotationRequestStatus } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const [reqData, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const { quotationReq, vendorsIdList } = reqData;

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

        await prisma.quotationRequest.create({
            data: {
                quotationRequestName: quotationReq.quotationRequestName,
                status: quotationReq.status as QuotationRequestStatus,
                pricing: quotationReq.pricing,
                createdBy: userEmailId!,
                updatedBy: userEmailId!,
                procurementId: quotationReq.procurementId,
                expiryDate: quotationReq.expiryDate,
                vendorIds :vendorsIdList,
                quotationRequestProducts : quotationReq.quotationRequestProducts!,
                productIds : productIds,
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


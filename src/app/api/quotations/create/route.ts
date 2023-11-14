import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, QuotationRequest } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { Quotation } from "@/types/quotation";
import { QuotationStatus } from "@/types/enums";

export const POST = async (request: NextRequest) => {
    try {
        // const reqData: Data = await request.json();
        // const { quotationReq, vendorsIdList } = reqData;
        const userEmailId = await getUserEmail()
        const quotation: any = {
            createdAt : new Date(),
            updatedAt : new Date(),
            createdBy : userEmailId!,
            updatedBy : userEmailId!,
            quotationName : "sahil",
            vendorId : "65362fe43ee4ee234d73f4cc",
            procurementId : "654b7d5b3d8beb2c4c29d2d4",
            total : 4500,
            amount : 4000,
            totalTax : 500,
            status : QuotationStatus.PENDING,
            expiryDate : new Date(),
            quotationProducts : {
                "yW9Vs6jrRnoFJQyjV2jm" : {
                    "supplierPrice" : 1500,
                    "requestedQty" : 16,
                    "acceptedQty" : 36,
                },
                "hoVEsTTxPEJLqIZPJsqd" :  {
                    "supplierPrice" : 2500,
                    "requestedQty" : 42,
                    "acceptedQty" : 52,
                }
            },
            productIds : ["654b7d5b3d8beb2c4c29d2d5", "654b7d5c3d8beb2c4c29d2d6"],
            quotationRequestId : "6552fab5ebee6fe8056077e0"

        }
        await prisma.quotation.create({
            data: quotation
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


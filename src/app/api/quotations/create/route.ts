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
            procurementId : "655392120c5e09d256b8d950",
            total : 4500,
            amount : 4000,
            totalTax : 500,
            status : QuotationStatus.PENDING,
            expiryDate : new Date(),
            quotationProducts : {
                "bm8MjWI5xxobDEwIEyEy" : {
                    "supplierPrice" : 1500,
                    "requestedQty" : 16,
                    "acceptedQty" : 36,
                },
                "tTwGnBy5TBRIHSiu8VLl" :  {
                    "supplierPrice" : 2500,
                    "requestedQty" : 42,
                    "acceptedQty" : 52,
                },
                "ZyTKHAstDbn3hsYqNuFE" :  {
                    "supplierPrice" : 2500,
                    "requestedQty" : 42,
                    "acceptedQty" : 52,
                }
            },
            productIds : ["6553576a0c5e09d256b8d947", "6553576b0c5e09d256b8d948", "6553576c0c5e09d256b8d949"],
            quotationRequestId : "655393220c5e09d256b8d954"
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


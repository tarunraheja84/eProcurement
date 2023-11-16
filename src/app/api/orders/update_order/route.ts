import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import {Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { Order } from "@/types/order";


export const POST = async (request: NextRequest) => {
    try {
        // const order: Order = await request.json();
        const order: any = {
            orderId : "6553973d0c5e09d256b8d958",
            status : "ACCEPTED",
            totalAmount : 3500,
            totalTax : 420,
            total : 3920,
            createdAt : new Date(),
            updatedAt : new Date(),
            updatedBy : "sahil",
            createdBy : "sahil",
            marketPlaceOrderId : "wSxwVwn71MAZOUQ0B0Fd",
            marketPlaceOrderUrl : "https://flavr-fb.el.r.appspot.com/orders/muJurcKkQJtSUUfdumn5/view#wSxwVwn71MAZOUQ0B0Fd",
            vendorId : "65362fe43ee4ee234d73f4cc",
            deliveryAddress : "Plot No 2, Landmark Tower, 4th Floor 113, Ashok Marg, opp. C, South City I, Gurugram, Haryana, 122001",
            quotationId : "655394760c5e09d256b8d955",
            orderItems : [
                {
                    id : "654b7d5c3d8beb2c4c29d2d6",
                    orderedQty : 15,
                    totalAmount : 3000,
                    totalTax : 360,
                    total : 3360,
                    receivedQty : 15,
                    unitPrice : 200,
                    taxes : {
                        igst : 12,
                        cgst : 6,
                        sgst : 6,
                        cess : 0
                    },
                    productId : "hoVEsTTxPEJLqIZPJsqd",
                    productName : "Apple - Fuji",
                    category : "Fresh Fruits",
                    categoryId : "freshfruits",
                    subCategory : "Apples & Pears",
                    subCategoryId : "apples&pears",
                    imgPath : "https://flavr-fb.web.app/img%2Fmaster%2Fproducts%2FApple%20-%20Fuji.jp…",
                    sellingPrice : 0,
                    packSize : "1 Each",
                    acceptedQty : 15,
                    isSellerAccepted : true,
                }, 
                {
                    id : "654b7d5b3d8beb2c4c29d2d5",
                    orderedQty : 5,
                    totalAmount : 500,
                    totalTax : 60,
                    total : 560,
                    receivedQty : 5,
                    unitPrice : 200,
                    taxes : {
                        igst : 12,
                        cgst : 6,
                        sgst : 6,
                        cess : 0
                    },
                    productId : "yW9Vs6jrRnoFJQyjV2jm",
                    productName : "Apple - Fuji",
                    category : "Fresh Fruits",
                    categoryId : "freshfruits",
                    subCategory : "Apples & Pears",
                    subCategoryId : "apples&pears",
                    imgPath : "https://flavr-fb.web.app/img%2Fmaster%2Fproducts%2FApple%20-%20Fuji.jp…",
                    sellingPrice : 0,
                    packSize : "1 Each",
                    acceptedQty : 5,
                    isSellerAccepted : true,
                }
            ]
        };

        // await generateInvoice({order : order})

        console.log('successfull :>> ');
        // return NextResponse.json(orderDetails);

    } catch (error: any) {
        console.log('error :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

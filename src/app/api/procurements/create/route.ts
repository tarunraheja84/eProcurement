import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { Product } from "@/types/product";

interface dbProduct{
    id:string,
    productId: string,
    productName: string,
    category: string,
    subCategory: string,
    categoryId:string,
    subCategoryId: string,
    imgPath:string,
    sellingPrice:number,
    packSize: string
    taxes:{
        igst:number,
        cgst:number,
        sgst:number,
        cess:number
    }
}
export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        //procurementPromise
        const procurementPromise=prisma.procurement.create({ data: body.procurementPlan });

        //productPromises
        const productPromises=body.productsArray.map((product:Product)=>{
                const productWithoutQuantity={...product}
                delete productWithoutQuantity.quantity;
                return prisma.product.create({ data: productWithoutQuantity });
        })
            
        const [procurement, ...products]=await Promise.all([procurementPromise, ...productPromises]);


        //procurementProductPromises
        const procurementProductPromises=products.map((product:dbProduct, index:number)=>{
            const procurementProductData = {
                procurementId: procurement.procurementId,
                productId:product.id,
                quantity: body.productsArray[index]!.quantity
            };
            return prisma.procurementProduct.create({ data: procurementProductData });
        })

        await Promise.all(procurementProductPromises)
        return new NextResponse();
    } catch (error: any) {
        console.log(error.message)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new NextResponse(error.message, { status: statusCode });
    }
};




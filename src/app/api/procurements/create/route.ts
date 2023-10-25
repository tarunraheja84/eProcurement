import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { fetchTaxes } from "@/services/taxes_service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const allPromises=[]
        const procurement=await prisma.procurement.create({ data: body.procurementPlan });
        const taxes=await fetchTaxes()
        console.log(taxes)
        for(const product of body.productsArray){
            const productWithoutQuantity={
                productId: product.productId ,
                productName: product.productName,
                category: product.category,
                categoryId: product.categoryId,
                subCategory: product.subCategory,
                subCategoryId: product.subCategoryId,
                imgPath: product.imgPath,
                sellingPrice: product.sellingPrice,
                packSize: product.packSize,
                GSTrate: product.GSTrate,
                cess: product.cess
            }
            allPromises.push(prisma.product.create({ data: productWithoutQuantity }));
            const procurementProduct = {
                procurementId: procurement.procurementId,
                productId: product.productId,
                quantity: product.quantity
            };
            allPromises.push(prisma.procurementProduct.create({ data: procurementProduct }))
        }
        await Promise.all(allPromises);
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

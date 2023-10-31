import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import fetchFromConfig  from "@/services/config_service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const allPromises=[]
        const [procurement, taxes]=await Promise.all([prisma.procurement.create({ data: body.procurementPlan }),
            fetchFromConfig("TAX_RATES")]);
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
                taxes:{
                    igst:product.taxes && product.taxes.igst? product.taxes.igst:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].igst ? taxes[product.categoryId][product.subCategoryId].igst:0),
                    cgst:product.taxes && product.taxes.cgst? product.taxes.cgst:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].cgst ? taxes[product.categoryId][product.subCategoryId].cgst:0),
                    sgst:product.taxes && product.taxes.sgst? product.taxes.sgst:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].sgst ? taxes[product.categoryId][product.subCategoryId].sgst:0),
                    cess:product.taxes && product.taxes.cess? product.taxes.cess:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].cess ? taxes[product.categoryId][product.subCategoryId].cess:0)
                }
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


export const PATCH = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const allPromises=[]
        const [procurement, taxes]=await Promise.all([prisma.procurement.update({ where: {
            procurementId:body.procurementPlan.procurementId
          },
          data: body.procurementPlan }), fetchFromConfig("TAX_RATES")]);
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
                taxes:{
                    igst:product.taxes && product.taxes.igst? product.taxes.igst:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].igst ? taxes[product.categoryId][product.subCategoryId].igst:0),
                    cgst:product.taxes && product.taxes.cgst? product.taxes.cgst:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].cgst ? taxes[product.categoryId][product.subCategoryId].cgst:0),
                    sgst:product.taxes && product.taxes.sgst? product.taxes.sgst:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].sgst ? taxes[product.categoryId][product.subCategoryId].sgst:0),
                    cess:product.taxes && product.taxes.cess? product.taxes.cess:(taxes[product.categoryId] && taxes[product.categoryId][product.subCategoryId] && taxes[product.categoryId][product.subCategoryId].cess ? taxes[product.categoryId][product.subCategoryId].cess:0)
                }
            }
            allPromises.push(prisma.product.update({ where: {
                productId:product.productId
              },
              data: productWithoutQuantity }));
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


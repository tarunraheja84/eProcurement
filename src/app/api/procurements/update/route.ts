import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, Product as PrismaProduct } from "@prisma/client";
import { Product } from "@/types/product";

interface dbProduct {
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

    const procurementId=body.procurementPlan.procurementId;
    delete body.procurementPlan.procurementId;

    // Update the procurement plan
    const updatedProcurement = await prisma.procurement.update({
      where: { procurementId },
      data: body.procurementPlan,
    });

    // Get the current products in the procurement plan
    const currentProcurementProducts = await prisma.procurementProduct.findMany({
      where: { procurementId: updatedProcurement.procurementId },
      include:{product:true}
    });

    // Identify products to delete and update
    const productsToDelete: string[] = [];
    const productsToUpdate: any[] = [];

    for (const procurementProduct of currentProcurementProducts) {
      const matchingProduct = body.productsArray.find(
        (p:PrismaProduct) => p.productId === procurementProduct.product.productId
      );
      if (!matchingProduct) {
        // Product has been dis-included
        productsToDelete.push(procurementProduct.productId);
      } else {
        // Update the quantity
        productsToUpdate.push({
          where: { id: procurementProduct.id },
          data: { quantity: matchingProduct.quantity },
        });
      }
    }

    // Delete products that have been dis-included
    if (productsToDelete.length > 0) {
      await prisma.procurementProduct.deleteMany({
        where: { productId: { in: productsToDelete } },
      });
      await prisma.product.deleteMany({
        where: { id: { in: productsToDelete } },
      });
    }

    // Update quantities for existing products
    if (productsToUpdate.length > 0) {
      for(const product of productsToUpdate){
        await prisma.procurementProduct.update(
          product
        );
      }
    }

    // Create new products if any
    const newProducts = body.productsArray.filter(
      (p:any) => !currentProcurementProducts.some((cp:any) => cp.product.productId === p.productId)
    );

    if (newProducts.length > 0) {
    const products=await Promise.all(newProducts.map((product:Product)=>{
                const productWithoutQuantity={...product}
                delete productWithoutQuantity.quantity;
                return prisma.product.create({ data: productWithoutQuantity });
    }))
      const newProcurementProductPromises = products.map((product: any, index:number) => {
        const procurementProductData = {
          procurementId: updatedProcurement.procurementId,
          productId: product.id,
          quantity: body.productsArray[index]!.quantity,
        };
        return prisma.procurementProduct.create({ data: procurementProductData });
      });

      await Promise.all(newProcurementProductPromises);
    }

    return new NextResponse();
  } catch (error: any) {
    console.log(error.message);
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        statusCode = 400;
      }
    }

    return new NextResponse(error.message, { status: statusCode });
  }
};

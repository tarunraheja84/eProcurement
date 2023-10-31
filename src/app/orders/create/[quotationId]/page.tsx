import PurchaseOrder from '@/app/orders/create/[quotationId]/purchaseOrder'
import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationProduct } from '@/types/quotationProduct';
import { Product } from '@/types/product'
import { deliveryAddress } from '@/utils/utils';

const page = async (context: any) => {
    const quotationId = context.params.quotationId;
    const quotation :any = await prisma.quotation.findFirst({ //TODO: required type
        where :{
            quotationId : quotationId
        },
        include : {
            quotationProducts : true,
            vendor : true,
            procurement :true,

        }
    })
    const productIds = quotation.quotationProducts.map((product:QuotationProduct) => product.productId);
    const products : any = await prisma.product.findMany({ //TODO: required type
        where: {
            id: { in: productIds },
        }
    })
    const productMap = new Map<string, Product>();
    products.forEach((product: Product) => {
      productMap.set(product.id, product);
    });
    return (
        <>
            <PurchaseOrder quotation={quotation} productMap={productMap} deliveryAddress={deliveryAddress}/>
        </>
    )
}

export default page
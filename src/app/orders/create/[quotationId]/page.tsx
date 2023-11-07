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
            quotationProducts : {
                include : {
                    product :true,
                }
            },
            vendor : true,
            procurement :true,

        }
    })
    const productMap = new Map<string, Product>();

    quotation.quotationProducts.forEach((quotationProduct: QuotationProduct) => {
        productMap.set(quotationProduct.productId, quotationProduct.product);
    });
    return (
        <>
            <PurchaseOrder quotation={quotation} productMap={productMap} deliveryAddress={deliveryAddress}/>
        </>
    )
}

export default page
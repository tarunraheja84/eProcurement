import PurchaseOrder from '@/app/orders/create/[quotationId]/purchaseOrder'
import React from 'react'
import prisma from '@/lib/prisma';
import { QuotationProduct } from '@/types/quotationProduct';
import { Product } from '@/types/product'
import { deliveryAddress } from '@/utils/utils';
import { Quotation } from '@/types/quotation';
interface QuotationProductsDetails {
    supplierPrice : number,
    requestedQty : number,
    acceptedQty : number,
}
const page = async (context: any) => {

    const quotationId = context.params.quotationId;
    const quotation :any = await prisma.quotation.findUnique({ //TODO: required type
        where :{
            quotationId : quotationId
        },
        include : {
            vendor : true,
            procurement :true,
            products : true

        }
    })
    const productMap = new Map<string, Product>();
    const quotationProductsDetails = new Map<string ,QuotationProductsDetails>()
    quotation.products!.forEach((product: Product) => {
        quotationProductsDetails.set(product.id!, {...quotation.quotationProducts[product.productId]})
        productMap.set(product.id!, product);
    });
    return (
        <>
            <PurchaseOrder quotation={quotation} productMap={productMap} deliveryAddress={deliveryAddress} quotationProductsDetails={quotationProductsDetails}/>
        </>
    )
    
}

export default page
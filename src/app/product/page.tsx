import React from 'react'
import Product from './product'
import prisma from '@/lib/prisma'
import axios from 'axios';
import { cloudFunctionsUrl } from "@/utils/utils";

const page = async () => {
    const [products, numberOfProducts]: any = await Promise.all([prisma.product.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        distinct: ['sellerProductId'],
        take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
    }),
    prisma.product.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        distinct: ['sellerProductId'],
    })
    ]);

    const sellerProductIds = products.map((product:any)=>product.sellerProductId);
    const result = await axios.post(cloudFunctionsUrl.getSellerProductsByProdu, {sellerProductIds});
    for(let i=0;i<products.length;i++){
        if(result.data[i])
            products[i].basePrice = result.data[i].sellingPrice;
    }
    return (
        <Product products={products} numberOfProducts={numberOfProducts.length}></Product>
    )
}

export default page
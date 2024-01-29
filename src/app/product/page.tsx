import React, { useState } from 'react'
import Product from './product'
import prisma from '@/lib/prisma'

const page = async () => {
    const [products, numberOfProducts]: any = await Promise.all([prisma.product.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
    }),
    prisma.product.count({
        orderBy: {
            updatedAt: 'desc'
        },
    })
    ]);

    return (
        <Product products={products} numberOfProducts={numberOfProducts}></Product>
    )
}

export default page
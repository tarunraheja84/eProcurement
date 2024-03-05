"use client"
import { Product, Taxes } from '@/types/product'
import { calculateGST, getTaxRates } from '@/utils/helperFrontendFunctions'
import { Pricing } from '@prisma/client'
import React, { useEffect, useState } from 'react'

type Props = {
    quotation: any,
    products: Product[],
    productsHeading: string
}
const QuotationProducts = ({ quotation, products, productsHeading }: Props) => {
    const [productIdTaxMap, setProductIdTaxMap] = useState<Map<string, Taxes> | null>(null);

    useEffect(() => {
        (async () => {
            const prodIdTaxMap = await getTaxRates(products);
            setProductIdTaxMap(prodIdTaxMap);
        })();
    }, []);

    return (
        <>
        {products.length>0 ? <div>
            <div className={`flex flex-col md:flex-row justify-between`}>
                <h2 className="md:text-2xl mb-4">{productsHeading}</h2>
                <div className="text-sm md:text-base">Total Products: {products!.length}</div>
            </div>
            <div className="shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
                {
                    products && products.map((product: Product, index: number) => {
                        return <div key={index} className='relative flex flex-col bg-white m-2 border rounded border-custom-gray-3'>
                            <div className='flex flex-row justify-between items-center w-full'>
                                <div className="flex flex-col md:flex-row ml-2 md:ml-0 justify-start items-center md:gap-4">
                                    <div className='flex flex-row'>
                                        <img src={product.imgPath} className=' w-14 h-14 border rounded md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                                        <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                                            <div className='text-sm md:text-base font-semibold'>{product.productName}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-sm md:text-base font-semibold'>Category: <span className="text-custom-blue">{product.category}</span></div>
                                        <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-custom-pink">{product.subCategory}</span></div>
                                    </div>
                                </div>
                                <div className="md:absolute m-2 top-0 right-0 cursor-pointer">
                                    <div className="">Base Price: ₹{quotation.quotationProducts[product.sellerProductId].supplierPrice}</div>
                                    {quotation.pricing === Pricing.FLAVRFOOD_PRICING && <div className="">Discount: {quotation.quotationProducts[product.sellerProductId].discountPercentage}%</div>}
                                    <div className="">GST: {calculateGST(productIdTaxMap!, product.productId)}%</div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row m-2">
                                <div className='border md:w-36 flex justify-center items-center pl-2 rounded-md focus:outline-none w-full' >
                                    {product.packSize}
                                </div>
                                <div className='flex flex-row md:justify-end mt-2 md:mt-0 mx-2'>
                                    <span>Quantity: {quotation.quotationProducts[product.sellerProductId].acceptedQty}</span>
                                </div>
                            </div>
                        </div>
                    }
                    )
                }
            </div>
        </div> : <></>}
        </>
    )
}

export default QuotationProducts

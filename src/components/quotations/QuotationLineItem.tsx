'use client'
import { Product, Taxes } from '@/types/product'
import React, { useState } from 'react'
import { Quotation } from '@/types/quotation'
import { calculateGST, formatAmount } from '@/utils/helperFrontendFunctions'

interface QuotationLineItemProps {
    product: Product,
    isVendor?: boolean,
    setQuotation: React.Dispatch<React.SetStateAction<Quotation>>,
    quotation: Quotation,
    productIdTaxMap?: Map<string, Taxes> | null,
    edit?: boolean,
    flavrFoodPricesFlag: boolean
}

const QuotationLineItem: React.FC<QuotationLineItemProps> = ({ product, isVendor, setQuotation, quotation, productIdTaxMap, edit, flavrFoodPricesFlag }) => {
    const quotationProducts= quotation.quotationProducts;
    const gstRate= calculateGST(productIdTaxMap!, product.productIdForTaxes);

    const defaultAcceptedQuantity= quotationProducts[product.productId].acceptedQty;
    const defaultPreGSTPrice= quotationProducts[product.productId].supplierPrice;
    const defaultPostGSTPrice= formatAmount(quotationProducts[product.productId].supplierPrice + (quotationProducts[product.productId].supplierPrice * gstRate) / 100);
    const discountPercentage= quotationProducts[product.productId].discountPercentage;
    
    const [acceptedQty, setAcceptedQty] = useState<number>(defaultAcceptedQuantity);
    const [preGSTPrice, setPreGSTPrice] = useState<number>(defaultPreGSTPrice);
    const [postGSTPrice, setPostGSTPrice] = useState<number>(defaultPostGSTPrice);

    const calculateAndSetAllFields=()=>{
    let amountWithoutDiscount=0, totalDiscount=0, totalTax=0;

    Object.keys(quotationProducts).forEach((productId) => {
        const acceptedQty= quotationProducts[productId].acceptedQty;
        const preGSTPrice= quotationProducts[productId].supplierPrice;
        const discountPercentage= quotationProducts[productId].discountPercentage;
        const productIdForTaxes= quotation.products?.find((product:Product)=>product.productId===productId)?.productIdForTaxes!;


        amountWithoutDiscount += formatAmount(acceptedQty * preGSTPrice);
        totalDiscount += formatAmount((acceptedQty * preGSTPrice * discountPercentage)/100);
        totalTax += formatAmount((acceptedQty * preGSTPrice * calculateGST(productIdTaxMap!, productIdForTaxes))/100)
    })

    const amount= amountWithoutDiscount-totalDiscount;
    const total= amount + totalTax;

    setQuotation({
        ...quotation,
        amount,
        totalTax,
        total,
        quotationProducts
    })
    }

    const handleAcceptedQtyChange = (e: any) => {
        const newAcceptedQty = Number(e.target.value);
        quotationProducts[product.productId].acceptedQty = newAcceptedQty;
        setAcceptedQty(newAcceptedQty);

        calculateAndSetAllFields();
    };

    const handlePreGSTPriceChange = (e: any) => {
        const newPreGSTPrice = Number(e.target.value);
        quotationProducts[product.productId].supplierPrice = newPreGSTPrice;

        const newPostGSTPrice = formatAmount(newPreGSTPrice + (newPreGSTPrice * gstRate) / 100);

        setPostGSTPrice(newPostGSTPrice);
        setPreGSTPrice(newPreGSTPrice);


        // for disabling the postGSTInput when preGSTInput gets filled

        // const postGSTInput = document.getElementById(`postGST_${product.productId}`);
        // if (e.target.value) {
        //     postGSTInput?.setAttribute('disabled', 'true');
        // }
        // else {
        //     postGSTInput?.removeAttribute('disabled');
        // }

        calculateAndSetAllFields();
    };

    const handlePostGSTPriceChange = (e: any) => {
        const newPostGSTPrice = Number(e.target.value);

        const newPreGSTPrice = formatAmount((newPostGSTPrice * 100) / (100 + gstRate));
        quotationProducts[product.productId].supplierPrice = newPreGSTPrice;

        setPreGSTPrice(newPreGSTPrice);
        setPostGSTPrice(newPostGSTPrice)


        // for disabling the preGSTInput when postGSTInput gets filled

        // const preGSTInput = document.getElementById(`preGST_${product.productId}`);
        // if (e.target.value) {
        //     preGSTInput?.setAttribute('disabled', 'true');
        // }
        // else {
        //     preGSTInput?.removeAttribute('disabled');
        // }

        calculateAndSetAllFields();
    };

    const handleDiscountPercentageChange = (e:any) =>{
        let newDiscountPercentage = Number(e.target.value);

        if(newDiscountPercentage>=0 && newDiscountPercentage<=100)
            quotationProducts[product.productId].discountPercentage = newDiscountPercentage;

        calculateAndSetAllFields();
    }

    return (
        <>
            <tr v-for="product in products" className={`${acceptedQty > 0 ? "" : "bg-disable-gray"}`}>
                <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.subCategory}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.packSize}</td>
                <td className="px-6 py-4 whitespace-nowrap">{quotationProducts[product.productId].requestedQty}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {isVendor ? (
                        <input
                            type="number"
                            className='border-2 border-custom-red text-center w-[75%]'
                            value={acceptedQty? acceptedQty: ""}
                            onChange={handleAcceptedQtyChange}
                        />
                    ) : (
                        `${acceptedQty > 0 ? acceptedQty : "-"}`
                    )}
                </td>

                {flavrFoodPricesFlag && <td className="px-6 py-4 whitespace-nowrap">
                    ₹23
                </td>}

                <td className="px-6 py-4 whitespace-nowrap">
                    {(edit || isVendor) ?
                        <input
                            type="number"
                            id={`preGST_${product.productId}`}
                            className='border-2 border-custom-red text-center outline-none w-[75%]'
                            value={preGSTPrice ? formatAmount(preGSTPrice) : ""}
                            onChange={handlePreGSTPriceChange}
                        /> : (
                            `${preGSTPrice > 0 ? `₹${formatAmount(preGSTPrice)}` : "-"}`
                        )
                    }
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    {gstRate}%
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    {(edit || isVendor) ?
                        <input
                            type="number"
                            id={`postGST_${product.productId}`}
                            className='border-2 border-custom-red text-center outline-none w-[80%]'
                            value={postGSTPrice ? formatAmount(postGSTPrice) : ""}
                            onChange={handlePostGSTPriceChange}
                        />
                        : (
                            `${postGSTPrice > 0 ? `₹${formatAmount(postGSTPrice)}` : "-"}`
                        )
                    }
                </td>
                
               {flavrFoodPricesFlag && <td className="px-6 py-4 whitespace-nowrap">
                    {(edit || isVendor) ?
                        <input
                            type="number"
                            className='border-2 border-custom-red text-center outline-none w-[80%]'
                            value={discountPercentage ? formatAmount(discountPercentage) : ""}
                            onChange={handleDiscountPercentageChange}
                        />
                        : (
                            `${discountPercentage > 0 ? `₹${formatAmount(discountPercentage)}` : "-"}`
                        )
                    }
                </td>}

                <td className="px-6 py-4 whitespace-nowrap">
                    ₹{formatAmount((acceptedQty * preGSTPrice) - (acceptedQty * preGSTPrice * discountPercentage)/100)}
                </td>
            </tr>
        </>
    )
}

export default QuotationLineItem
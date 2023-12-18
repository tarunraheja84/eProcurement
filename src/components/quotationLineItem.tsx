'use client'
import { Product, Taxes } from '@/types/product'
import React, { useState } from 'react'
import { Quotation, QuotationProducts } from '@/types/quotation'
import { formatAmount } from '@/utils/helperFrontendFunctions'

interface QuotationLineItemProps {
    product: Product,
    isVendor?: boolean,
    setQuotation: React.Dispatch<React.SetStateAction<Quotation>>,
    quotation: Quotation,
    productIdTaxMap?: Map<string, Taxes> | null,
    edit?: boolean
}

const QuotationLineItem: React.FC<QuotationLineItemProps> = ({ product, isVendor, setQuotation, quotation, productIdTaxMap, edit }) => {

    const quotationProductsDetails: { [key: string]: QuotationProducts } = {}
    quotation.products!.forEach((product: Product) => {
        quotationProductsDetails[product.productId!] = { ...quotation.quotationProducts[product.productId] }
    });
    
    const [acceptedQty, setAcceptedQty] = useState<number>(quotationProductsDetails[product.productId].acceptedQty);
    const [preGSTPrice, setPreGSTPrice] = useState<number>(quotationProductsDetails[product.productId].supplierPrice);
    const [postGSTPrice, setPostGSTPrice] = useState<number>(quotationProductsDetails[product.productId].supplierPrice);


    const taxes: Taxes | undefined = productIdTaxMap!.get(product.productId!)
    const [igst, cgst, sgst, cess] = taxes ? [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0] : [0, 0, 0, 0]
    const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);

    const handleAcceptedQtyChange = (e: any) => {
        const newAcceptedQty = Number(e.target.value);
        setAcceptedQty(newAcceptedQty);

        let amount = 0;
        Object.keys(quotationProductsDetails).forEach((productId) => {
            if (productId === product.productId) {
                quotationProductsDetails[productId].acceptedQty = newAcceptedQty
            }
            amount = formatAmount(amount+ (quotationProductsDetails[productId].acceptedQty * quotationProductsDetails[productId].supplierPrice));
        })

        const totalTax = amount * itemTotalTaxRate / 100
        const totalDiscount= amount* (quotation?.discountPercentage)/100;
        const total = amount + totalTax - totalDiscount

        setQuotation({
            ...quotation,
            total: total,
            totalTax: totalTax,
            amount: amount,
            quotationProducts: quotationProductsDetails
        })
    };

    const handlePreGSTPriceChange = (e: any) => {
        let newPreGSTPrice = Number(e.target.value);
        //price after adding GST
        let newPostGSTPrice = newPreGSTPrice + (newPreGSTPrice * itemTotalTaxRate) / 100;
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

        let amount = 0;
        Object.keys(quotationProductsDetails).forEach((productId) => {
            if (productId === product.productId) {
                quotationProductsDetails[productId].supplierPrice = newPreGSTPrice
            }
            amount = formatAmount(amount+ (quotationProductsDetails[productId].acceptedQty * quotationProductsDetails[productId].supplierPrice));
        })

        const totalTax = amount * itemTotalTaxRate / 100
        const totalDiscount= amount* (quotation?.discountPercentage)/100;
        const total = amount + totalTax - totalDiscount

        setQuotation({
            ...quotation,
            total: total,
            totalTax: totalTax,
            amount: amount,
            quotationProducts: quotationProductsDetails
        })
    };

    const handlePostGSTPriceChange = (e: any) => {
        let newPostGSTPrice = Number(e.target.value);
        //price after removing GST
        let newPreGSTPrice = (newPostGSTPrice * 100) / (100 + itemTotalTaxRate);
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

        let amount = 0;
        Object.keys(quotationProductsDetails).forEach((productId) => {
            if (productId === product.productId) {
                quotationProductsDetails[productId].supplierPrice = newPreGSTPrice
            }
            amount = formatAmount(amount+ (quotationProductsDetails[productId].acceptedQty * quotationProductsDetails[productId].supplierPrice));
        })

        const totalTax = amount * itemTotalTaxRate / 100
        const totalDiscount= amount* (quotation?.discountPercentage)/100;
        const total = amount + totalTax - totalDiscount

        setQuotation({
            ...quotation,
            total: total,
            totalTax: totalTax,
            amount: amount,
            quotationProducts: quotationProductsDetails

        })
    };

    return (
        <>
            <tr v-for="product in products" className={`${acceptedQty > 0 ? "" : "bg-disable-grey"}`}>
                <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.subCategory}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.packSize}</td>
                <td className="px-6 py-4 whitespace-nowrap">{quotationProductsDetails[product.productId].requestedQty}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {isVendor ? (
                        <input
                            type="number"
                            className='border-2 border-custom-red text-center w-[75%]'
                            defaultValue={acceptedQty}
                            onChange={handleAcceptedQtyChange}
                        />
                    ) : (
                        `${acceptedQty > 0 ? acceptedQty : "-"}`
                    )}
                </td>
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
                
                <td className="px-6 py-4 whitespace-nowrap">
                    ₹{(formatAmount(preGSTPrice -  (preGSTPrice* quotation?.discountPercentage)/100))}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    {itemTotalTaxRate}%
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    ₹{formatAmount(acceptedQty * preGSTPrice)}
                </td>
            </tr>
        </>
    )
}

export default QuotationLineItem
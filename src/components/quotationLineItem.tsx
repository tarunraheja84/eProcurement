'use client'
import { Product, Taxes } from '@/types/product'
import React, { useState } from 'react'
import { Quotation, QuotationProducts } from '@/types/quotation'
import { formatAmount, formattedPrice } from '@/utils/helperFrontendFunctions'
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
    const [supplierPrice, setSupplierPrice] = useState<number>(quotationProductsDetails[product.productId].supplierPrice);
    const [postGSTPrice, setPostGSTPrice] = useState<number>(quotationProductsDetails[product.productId].supplierPrice);
    const productId = product.productId
    const taxes: Taxes | undefined = productIdTaxMap!.get(productId!)
    const [igst, cgst, sgst, cess] = taxes ? [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0] : [0, 0, 0, 0]
    const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
    const handleAcceptedQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAcceptedQty = parseInt(event.target.value);
        setAcceptedQty(newAcceptedQty);

        let [amount, total, totalTax] = [0, 0, 0]
        Object.keys(quotationProductsDetails).forEach((key) => {
            if (key === productId) {
                if (newAcceptedQty === 0) {
                    setSupplierPrice(0)
                    quotationProductsDetails[key].supplierPrice = 0
                }
                quotationProductsDetails[key].acceptedQty = newAcceptedQty
            }
            amount = formatAmount(amount + (quotationProductsDetails[key].acceptedQty * quotationProductsDetails[key].supplierPrice))
            totalTax = amount * itemTotalTaxRate / 100
        })
        total = formatAmount(total + amount + totalTax)
        setQuotation({
            ...quotation,
            total: total,
            totalTax: totalTax,
            amount: amount,
            quotationProducts: quotationProductsDetails
        })
    };

    const handlePreGSTPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newSupplierPrice = parseInt(event.target.value);
        //price after adding GST
        let newPostGSTPrice = newSupplierPrice + (newSupplierPrice * itemTotalTaxRate) / 100;
        setPostGSTPrice(newPostGSTPrice);
        setSupplierPrice(newSupplierPrice);


        // for disabling the postGSTInput when preGSTInput gets filled

        // const postGSTInput = document.getElementById(`postGST_${product.productId}`);
        // if (event.target.value) {
        //     postGSTInput?.setAttribute('disabled', 'true');
        // }
        // else {
        //     postGSTInput?.removeAttribute('disabled');
        // }

        let [amount, total, totalTax] = [0, 0, 0]
        Object.keys(quotationProductsDetails).forEach((key) => {
            if (key === productId) {
                if (acceptedQty === 0) {
                    setSupplierPrice(0)
                    newSupplierPrice = 0
                }
                quotationProductsDetails[key].supplierPrice = newSupplierPrice
            }
            amount = formatAmount(amount + (quotationProductsDetails[key].supplierPrice * quotationProductsDetails[key].acceptedQty))
            totalTax = amount * itemTotalTaxRate / 100
        })
        total = formatAmount(total + amount + totalTax)
        setQuotation({
            ...quotation,
            total: total,
            totalTax: totalTax,
            amount: amount,
            quotationProducts: quotationProductsDetails

        })
    };

    const handlePostGSTPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newPostGSTPrice = parseInt(event.target.value);
        //price after removing GST
        let newSupplierPrice = (newPostGSTPrice * 100) / (100 + itemTotalTaxRate);
        setSupplierPrice(newSupplierPrice);
        setPostGSTPrice(newPostGSTPrice)


        // for disabling the preGSTInput when postGSTInput gets filled

        // const preGSTInput = document.getElementById(`preGST_${product.productId}`);
        // if (event.target.value) {
        //     preGSTInput?.setAttribute('disabled', 'true');
        // }
        // else {
        //     preGSTInput?.removeAttribute('disabled');
        // }

        let [amount, total, totalTax] = [0, 0, 0]
        Object.keys(quotationProductsDetails).forEach((key) => {
            if (key === productId) {
                if (acceptedQty === 0) {
                    setSupplierPrice(0)
                    newSupplierPrice = 0
                }
                quotationProductsDetails[key].supplierPrice = newSupplierPrice
            }
            amount = formatAmount(amount + (quotationProductsDetails[key].supplierPrice * quotationProductsDetails[key].acceptedQty))
            totalTax = amount * itemTotalTaxRate / 100
        })
        total = formatAmount(total + amount + totalTax)
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
                            className='border-2 border-custom-red text-center w-[50%]'
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
                            className='border-2 border-custom-red text-center outline-none w-[50%]'
                            value={supplierPrice ? formatAmount(supplierPrice) : NaN}
                            onChange={handlePreGSTPriceChange}
                        /> : (
                            `${supplierPrice > 0 ? formattedPrice(formatAmount(supplierPrice)) : "-"}`
                        )
                    }
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    {(edit || isVendor) ?
                        <input
                            type="number"
                            id={`postGST_${product.productId}`}
                            className='border-2 border-custom-red text-center outline-none w-[50%]'
                            value={postGSTPrice ? formatAmount(postGSTPrice) : NaN}
                            onChange={handlePostGSTPriceChange}
                        />
                        : (
                            `${postGSTPrice > 0 ? formattedPrice(formatAmount(postGSTPrice)) : "-"}`
                        )
                    }
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    {itemTotalTaxRate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {formattedPrice(formatAmount(acceptedQty * supplierPrice))}
                </td>
            </tr>
        </>
    )
}

export default QuotationLineItem
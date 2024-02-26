import { ProductStatus } from '@/types/enums';
import { Product, Taxes } from '@/types/product';
import { QuotationProducts } from '@/types/quotation';
import { calculateGST, formatAmount } from '@/utils/helperFrontendFunctions';
import { Pricing } from '@prisma/client';
import React, { useEffect, useState } from 'react'


type Props={
    product:any
    quotation: any,
    setQuotation: Function,
    oldQuotationProducts: {
        [key: string]: QuotationProducts; 
    },
    productIdTaxMap:Map<string, Taxes> | null
}
const QuotationItemRow = ({quotation, setQuotation, oldQuotationProducts, product, productIdTaxMap}:Props) => {
    const gstRate = calculateGST(productIdTaxMap!, product.productId);
    
    const newQuotationProducts = quotation.quotationProducts;
    const defaultAcceptedQuantity = newQuotationProducts[product.sellerProductId].acceptedQty;
    const defaultPreGSTPrice = newQuotationProducts[product.sellerProductId].supplierPrice;
    const defaultPostGSTPrice = formatAmount(newQuotationProducts[product.sellerProductId].supplierPrice + (newQuotationProducts[product.sellerProductId].supplierPrice * gstRate) / 100);
    const discountPercentage= newQuotationProducts[product.sellerProductId].discountPercentage;

    const [acceptedQty, setAcceptedQty] = useState<number>(defaultAcceptedQuantity);
    const [preGSTPrice, setPreGSTPrice] = useState<number>(defaultPreGSTPrice);
    const [postGSTPrice, setPostGSTPrice] = useState<number>(defaultPostGSTPrice);

    const calculateAndSetAllFields = () => {
        let amountWithoutDiscount = 0, totalDiscount = 0, totalTax = 0;

        Object.keys(newQuotationProducts).forEach((sellerProductId) => {
            const acceptedQty = newQuotationProducts[sellerProductId].acceptedQty;
            const preGSTPrice = newQuotationProducts[sellerProductId].supplierPrice;
            const discountPercentage = newQuotationProducts[sellerProductId].discountPercentage;
            const productId = quotation.products?.find((product: Product) => product.sellerProductId === sellerProductId)?.productId!;


            amountWithoutDiscount += formatAmount(acceptedQty * preGSTPrice);
            totalDiscount += formatAmount((acceptedQty * preGSTPrice * discountPercentage) / 100)
            totalTax += formatAmount((acceptedQty * preGSTPrice * calculateGST(productIdTaxMap!, productId)) / 100)

            if(newQuotationProducts[sellerProductId].discountPercentage===oldQuotationProducts[sellerProductId].discountPercentage && 
                newQuotationProducts[sellerProductId].acceptedQty===oldQuotationProducts[sellerProductId].acceptedQty)
                newQuotationProducts[sellerProductId].productStatus=oldQuotationProducts[sellerProductId].productStatus;
            else
                newQuotationProducts[sellerProductId].productStatus = ProductStatus.OLD_UPDATED;

            if(oldQuotationProducts[sellerProductId].productStatus===ProductStatus.NEW)
                    newQuotationProducts[sellerProductId].productStatus = ProductStatus.NEW;
        })

        let amount = amountWithoutDiscount;
        if (quotation.pricing === Pricing.FLAVRFOOD_PRICING)
            amount = amountWithoutDiscount - totalDiscount;

        const total = amount + totalTax;

        setQuotation({
            ...quotation,
            amount,
            totalTax,
            total,
            quotationProducts:newQuotationProducts
        })
    }

    const handleAcceptedQtyChange = (e: any) => {
        const newAcceptedQty = Number(e.target.value);
        newQuotationProducts[product.sellerProductId].acceptedQty = newAcceptedQty;

        setAcceptedQty(newAcceptedQty);

        calculateAndSetAllFields();
    };

    const handlePreGSTPriceChange = (e: any) => {
        const newPreGSTPrice = Number(e.target.value);
        newQuotationProducts[product.sellerProductId].supplierPrice = newPreGSTPrice;

        const newPostGSTPrice = formatAmount(newPreGSTPrice + (newPreGSTPrice * gstRate) / 100);

        setPostGSTPrice(newPostGSTPrice);
        setPreGSTPrice(newPreGSTPrice);


        // for disabling the postGSTInput when preGSTInput gets filled

        // const postGSTInput = document.getElementById(`postGST_${product.sellerProductId}`);
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
        newQuotationProducts[product.sellerProductId].supplierPrice = newPreGSTPrice;

        setPreGSTPrice(newPreGSTPrice);
        setPostGSTPrice(newPostGSTPrice)


        // for disabling the preGSTInput when postGSTInput gets filled

        // const preGSTInput = document.getElementById(`preGST_${product.sellerProductId}`);
        // if (e.target.value) {
        //     preGSTInput?.setAttribute('disabled', 'true');
        // }
        // else {
        //     preGSTInput?.removeAttribute('disabled');
        // }

        calculateAndSetAllFields();
    };

    const handleDiscountPercentageChange = (e: any) => {
        let newDiscountPercentage = Number(e.target.value);

        if (newDiscountPercentage >= 0 && newDiscountPercentage <= 100)
            newQuotationProducts[product.sellerProductId].discountPercentage = newDiscountPercentage;

        calculateAndSetAllFields();
    }

    useEffect(()=>{
        setPostGSTPrice(defaultPostGSTPrice);
    })
    return (
            <tr className={`${acceptedQty > 0 ? "border-b border-black" : "bg-custom-gray-3"}`}>
                <td className="p-2 text-center border-r align-middle">{product.productName}</td>
                <td className="p-2 text-center border-r align-middle">{product.category}</td>
                <td className="p-2 text-center border-r align-middle">{product.subCategory}</td>
                <td className="p-2 text-center border-r align-middle">{product.packSize}</td>
                <td className="p-2 text-center border-r align-middle">{newQuotationProducts[product.sellerProductId].requestedQty}</td>
                <td className="p-2 text-center border-r align-middle">
                    <input
                        type="number"
                        className='px-2 border border-custom-theme rounded outline-none w-[75%] md:w-[50%]'
                        value={acceptedQty ? acceptedQty : ""}
                        onChange={handleAcceptedQtyChange}
                    />
                </td>

                <td className="p-2 text-center border-r align-middle">
                    {quotation.pricing === Pricing.MANUAL_PRICING ?
                        <input
                            type="number"
                            id={`preGST_${product.sellerProductId}`}
                            className='px-2 border border-custom-theme rounded outline-none w-[75%] md:w-[50%]'
                            value={preGSTPrice ? formatAmount(preGSTPrice) : ""}
                            onChange={handlePreGSTPriceChange}
                        /> : (
                            `${preGSTPrice > 0 ? `₹${formatAmount(preGSTPrice)}` : "-"}`
                        )
                    }
                </td>

                <td className="p-2 text-center border-r align-middle">
                    {gstRate}%
                </td>

                <td className="p-2 text-center border-r align-middle">
                    {quotation.pricing === Pricing.MANUAL_PRICING ?
                        <input
                            type="number"
                            id={`postGST_${product.sellerProductId}`}
                            className='px-2 border border-custom-theme rounded outline-nonenone w-[75%] md:w-[50%]'
                            value={postGSTPrice ? formatAmount(postGSTPrice) : ""}
                            onChange={handlePostGSTPriceChange}
                        />
                        : (
                            `${postGSTPrice > 0 ? `₹${formatAmount(postGSTPrice)}` : "-"}`
                        )
                    }
                </td>

                {quotation.pricing === Pricing.FLAVRFOOD_PRICING && <td className="p-2 text-center border-r align-middle">
                    <input
                        type="number"
                        className='px-2 individualDiscountInput border rounded border-custom-theme outline-none w-[75%] md:w-[50%]'
                        value={discountPercentage ? discountPercentage : ""}
                        onChange={handleDiscountPercentageChange}
                    />
                </td>}

                <td className="p-2 text-center align-middle">
                    {quotation.pricing === Pricing.FLAVRFOOD_PRICING ? `₹${formatAmount((acceptedQty * preGSTPrice) - (acceptedQty * preGSTPrice * newQuotationProducts[product.sellerProductId].discountPercentage) / 100)}` :
                        `₹${(formatAmount(acceptedQty * preGSTPrice))}`
                    }
                </td>
            </tr>
  )
}

export default QuotationItemRow

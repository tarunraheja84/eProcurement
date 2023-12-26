'use client'
import Loading from '@/app/loading'
import QuotationForm from '@/components/quotationForm'
import { MarketPlaceProduct, Taxes } from '@/types/product'
import { Quotation } from '@/types/quotation'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
interface Props {
  quotation: Quotation,
  isViewOnly?: boolean,
  isVendor?: boolean,
}

const QuotationClient = (props: Props) => {
  const isViewOnly = props.isViewOnly ? true : false;
  const [quotation, setQuotation] = useState<Quotation>(props.quotation)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [productIdTaxMap, setProductIdTaxMap] = useState<Map<string, Taxes> | null>(null);

  const getTaxRates = async () => {
    const productIds = {
      "productIds":  Object.keys(quotation.quotationProducts)
    }
    const result = await axios.post("/api/tax_rates", productIds)
    const products = result.data;
    const prodIdTaxMap = new Map();
    // Iterate through the products array and populate the map
    products.forEach((product: MarketPlaceProduct) => {
      if (product.productId && product.taxes) {
        prodIdTaxMap.set(product.productId, product.taxes);
      }
    });
    setProductIdTaxMap(prodIdTaxMap)
    setIsLoading(false);
  }

  useEffect(() => {
    getTaxRates()
  }, [])

  return (
    <>
      {isLoading && <Loading />}
      <h1 className="text-2xl font-bold text-custom-red mb-4">{`Quotation Details`}</h1>
      <hr className="border-custom-red border mb-4" />
      <div className="flex flex-col mx-auto">
        {quotation && productIdTaxMap && <QuotationForm quotation={quotation} setQuotation={setQuotation} isVendor={props.isVendor} productIdTaxMap={productIdTaxMap} isViewOnly={isViewOnly} />}
      </div>
    </>
  )
}

export default QuotationClient
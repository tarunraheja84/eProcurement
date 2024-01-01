'use client'
import Loading from '@/app/loading'
import QuotationForm from '@/components/quotations/QuotationForm'
import { MarketPlaceProduct, Product, Taxes } from '@/types/product'
import { Quotation } from '@/types/quotation'
import { getTaxRates } from '@/utils/helperFrontendFunctions'
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
  
  const productIds= quotation.products?.map((product:Product)=>product.productIdForTaxes)!;


  useEffect(() => {
    (async ()=>{
      const prodIdTaxMap= await getTaxRates(productIds);
      setProductIdTaxMap(prodIdTaxMap);
      setIsLoading(false);})();
  }, [])

  return (
    <>
      {isLoading && <Loading />}
      <h1 className="text-2xl font-bold text-custom-red mb-4">{`Quotation Details`}</h1>
      <hr className="border-custom-red border mb-4" />
      <div className="flex flex-col mx-auto">
        {quotation && productIdTaxMap && <QuotationForm quotation={quotation} setQuotation={setQuotation} isVendor={props.isVendor} productIdTaxMap={productIdTaxMap} isViewOnly={isViewOnly} flavrFoodPricesFlag={props.quotation.flavrFoodPricesFlag}/>}
      </div>
    </>
  )
}

export default QuotationClient
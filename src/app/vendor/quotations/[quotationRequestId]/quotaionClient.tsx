'use client'
import QuotationForm from '@/components/quotationForm'
import { Quotation } from '@/types/quotation'
import axios from 'axios'
import { useRouter } from "next/navigation"
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { MarketPlaceProduct, Taxes } from '@/types/product'
import { QuotationStatus } from '@prisma/client'
import Loading from '@/app/vendor/loading'
import { useCookies } from 'react-cookie';

interface Props {
  quotationRequest: any,
  isVendor: boolean,
  isVendorCanCreateQuotation : boolean,
  activeQuotationsOfSameVendor: any
}
const QuotaionClient = (props: Props) => {
  const quotationRequest = props.quotationRequest
  const [cookies] : any = useCookies(['user']);
  const vendorId = cookies.vendorId;
  const router = useRouter()
  const quotationProducts = Object.entries(props.quotationRequest.quotationRequestProducts).reduce((acc: any, [productId, requestedQty]) => {
    acc[productId] = {
      requestedQty,
      acceptedQty: requestedQty,
      supplierPrice: 0,
    };
    return acc;
  }, {});


  const getArrayWithIndividualElements=(arr: any)=>{
    let newArr:any=[];
    for(const el of arr){
      if(Array.isArray(el))
        newArr=[...newArr, ...getArrayWithIndividualElements(el)];
      else
        newArr=[...newArr, el];
    }
    return newArr;
  }


  const getObjectWithIndividualElements=(arr:any)=>{
    let newObj:any={};
    for(const el of arr){
      newObj={...newObj, ...el}
    }
    return newObj;
  }


  const [quotation, setQuotation] = useState<Quotation>({
    quotationName: quotationRequest.quotationRequestName,
    status: QuotationStatus.PENDING,
    procurementId: quotationRequest.procurementId!,
    vendorId: vendorId!,
    expiryDate: new Date(),
    total: 0,
    amount: 0,
    totalTax: 0,
    discountPercentage:props.activeQuotationsOfSameVendor[0]?.discountPercentage? props.activeQuotationsOfSameVendor[0].discountPercentage: 0,
    quotationProducts: {...quotationProducts, ...getObjectWithIndividualElements(props.activeQuotationsOfSameVendor.map((quotation: Quotation)=>quotation.quotationProducts))}, 
    productIds: [...quotationRequest.productIds!, ...getArrayWithIndividualElements(props.activeQuotationsOfSameVendor.map((quotation: Quotation)=>quotation.productIds))],
    products: [...quotationRequest.products!, ...getArrayWithIndividualElements(props.activeQuotationsOfSameVendor.map((quotation: Quotation)=>quotation.products))],
    quotationRequestId: quotationRequest.quotationRequestId!
  })

  
  const handleCreateQuotation = async () => {
    delete quotation.products
    const promises=[];
    
    setIsLoading(true);
    if(props.activeQuotationsOfSameVendor.length){
      for(const activeQuotation of props.activeQuotationsOfSameVendor){
        promises.push(axios.put("/api/quotations/update", {quotation:{status: QuotationStatus.VOID}, quotationId:activeQuotation.quotationId}))
      } 
    }

    promises.push(axios.post("/api/quotations/create", quotation));

    try{
      await Promise.all(promises);
    }catch(error){
      console.log('error :>> ', error);
    }
    setIsLoading(false);
    alert("quotation sent successfully")
    router.push("/quotations")
  }

  const [productIdTaxMap, setProductIdTaxMap] = useState<Map<string, Taxes> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getTaxRates = async () => {
    const productIds = {
      "productIds": Object.keys(quotation.quotationProducts)
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
      {isLoading ? <Loading />:
      <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-custom-red mb-4">Create Quotation</h1>
        <hr className="border-custom-red border mb-4" />
        <div className="bg-light-red rounded-lg shadow-md p-4">
          <h2 className="font-bold text-custom-red mb-4">Quotation Request Details</h2>
          <div className="flex flex-row items-center gap-8 mb-6">
            <div className='flex'>
              <p className="font-bold text-gray-600">Name: </p><span className="text-gray-600">{quotationRequest.quotationRequestName}</span>
            </div>
            <div className='flex'>
              <p className="font-bold text-gray-600">Id: </p><span className="text-gray-600">{quotationRequest.quotationRequestId}</span>
            </div>
            <div className='flex'>
              <p className="font-bold text-gray-600">Expiry Date:  </p><span className="text-gray-600">{quotationRequest.expiryDate?.toDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      {quotation && productIdTaxMap && <QuotationForm quotation={quotation} setQuotation={setQuotation} isVendor={props.isVendor} productIdTaxMap={productIdTaxMap} />}
      {props.isVendorCanCreateQuotation && <div className="flex justify-center ">
        <Button
          label="Create Quote"
          type="submit"
          icon="pi pi-check"
          className={`w-full mb-[1rem] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red ${quotation.total > 0 && quotation.discountPercentage>=0 && quotation.discountPercentage<=100 ? "" : "bg-disable-grey pointer-events-none"}`}
          onClick={handleCreateQuotation}
        />
      </div>}
      </>}
    </>
  )
}

export default QuotaionClient


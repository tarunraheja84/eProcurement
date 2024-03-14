import React from 'react'
import { Product, Quotation, QuotationRequestStatus, QuotationStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import ViewQuotationRequest from '@/components/quotation_requests/ViewQuotationRequest';

const page = async (context: any) => {
    const quotationRequestId = context.params.quotationRequestId;
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value

    const [quotationRequest, activeQuotationsOfSameVendor] = await Promise.all([
        prisma.quotationRequest.findUnique({
            where: {
                quotationRequestId
            },
            include: {
                products: true
            },
        }),
        prisma.quotation.findMany({
            where: {
                vendorId: vendorId,
                status:{
                    in:[QuotationStatus.ACCEPTED, QuotationStatus.PENDING]
                } 
            },
            include: {
                products: true
            },
            orderBy: {
                updatedAt: 'desc'
            },
        })
    ])

    const getObjectWithIndividualElements = (arr: any) => {
        let newObj: any = {};
        for (const el of arr) {
            if (Array.isArray(el))
                newObj = { ...newObj, ...getObjectWithIndividualElements(el) }
            else
                newObj = { ...newObj, ...el }
        }
        return newObj;
    }

    const getArrayWithIndividualElements = (arr: any) => {
        let newArr: any = [];
        for (const el of arr) {
            if (Array.isArray(el))
                newArr = [...newArr, ...getArrayWithIndividualElements(el)];
            else
                newArr = [...newArr, el];
        }
        return newArr;
    }

    const getQuotationRequestProducts = () =>{
        let quotationRequestProducts : {
                [key: string]: number; 
        }={};

        const newQuotationRequestProducts:any= quotationRequest?.quotationRequestProducts;
        const oldQuotationRequestProducts= getObjectWithIndividualElements(activeQuotationsOfSameVendor.map((quotation: Quotation) =>   Object.keys(Object(quotation.quotationProducts)).reduce((acc:any, key) => {
            acc[key] = Object(quotation.quotationProducts)[key].requestedQty
            return acc;
        }, {})));

        for(const sellerProductId of Object.keys(oldQuotationRequestProducts))
            quotationRequestProducts![sellerProductId]= oldQuotationRequestProducts[sellerProductId];

        for(const sellerProductId of Object.keys(newQuotationRequestProducts))
            quotationRequestProducts![sellerProductId]= newQuotationRequestProducts[sellerProductId];
       
        return quotationRequestProducts!;
    }

    const getProducts = () =>{
        const products = [...quotationRequest?.products!, ...getArrayWithIndividualElements(activeQuotationsOfSameVendor.map((quotation: any) => quotation.products))];
        const sellerProductIdProductMap= new Map<string,Product>();
        for(const product of products){
            sellerProductIdProductMap.set(product.sellerProductId, product); 
        }
       return Array.from(sellerProductIdProductMap.values());
    }

    const getProductIds = () =>{
        return getProducts().map((product : Product)=>product.id);
    }


    if (quotationRequest?.status === QuotationRequestStatus.ACTIVE) {
        quotationRequest.quotationRequestProducts = getQuotationRequestProducts();
        quotationRequest.products = getProducts();
        quotationRequest.productIds = getProductIds();
    }

    return (
        <ViewQuotationRequest quotationRequest={quotationRequest} />
    )
}

export default page
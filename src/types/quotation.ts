import { Pricing, Procurement, QuotationStatus } from "@prisma/client";
import { Vendor } from "./vendor"

import { Product } from '@/types/product'
import { ProductStatus } from "./enums";

export type Quotation  = {
    quotationId?: string,
    pricing: Pricing,
    createdAt: Date,
    createdBy: string,
    updatedBy: string,
    updatedAt: Date,
    quotationName: string,
    vendor?:  Vendor,
    vendorId: string,
    procurementId: string,
    discountPercentage: number,
    total: number,
    amount: number,
    totalTax: number,
    status: QuotationStatus,
    expiryDate : Date,
    quotationProducts: {
        [key: string]: QuotationProducts; // Nested objects for each product key
    }
    procurement? : Procurement,
    productIds : string[],
    quotationRequestId : string,
    products? : Product[], 
}

export type QuotationProducts = {
    supplierPrice : number,
    acceptedQty : number,
    requestedQty : number,
    productStatus : ProductStatus,
    discountPercentage : number
}
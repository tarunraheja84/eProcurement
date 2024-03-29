import { Pricing, Procurement, QuotationRequestStatus } from "@prisma/client"
import { Vendor } from "./vendor"
import { Product } from '@/types/product'

export type QuotationRequest  = {
    quotationRequestId?: string,
    quotationRequestName : string,
    pricing: Pricing,
    createdAt?: Date,
    createdBy: string,
    updatedBy: string,
    updatedAt?: Date,
    vendors?:  Vendor[],
    vendorIds? : string[],
    procurement? : Procurement,
    procurementId?: string,
    status: QuotationRequestStatus,
    quoteProducts?: string,
    expiryDate : Date,
    quotationRequestProducts : {
        [key: string]: number; 
    },
    productIds? : string[],
    products? : Product[],
}

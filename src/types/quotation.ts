import { Procurement } from "./procurement"
import { QuotationProduct } from "./quotationProduct"
import { Vendor } from "./vendor"

import { Product } from '@/types/product'

export type Quotation  = {
    quotationId: string,
    createdAt?: Date,
    createdBy: string,
    updatedBy: string,
    updatedAt?: Date,
    quotationName: string,
    vendor?:  Vendor,
    vendorId: string,
    procurementId: string,
    total: number,
    amount: number,
    totalTax: number,
    status: string,
    expiryDate : Date,
    quotationProducts: {},
    procurement? : Procurement,
    productIds : string[],
    quotationRequestId : string,
    products? : Product[], 
}
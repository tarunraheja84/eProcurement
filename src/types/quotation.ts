import { Vendor } from "./vendor"


export type Quotation  = {
    quotationId: string,
    createdAt?: Date,
    createdBy: string,
    updatedBy: string,
    updatedAt?: Date,
    quotationName: string,
    vendor:  Vendor
    vendorId: string,
    procurementId: string,
    total: string,
    amount: string,
    totalTax: string,
    status: string,
    quoteProducts: string,
    expiryDate : Date,
    
}
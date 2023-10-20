import { QuotationRequestStatus } from "./enums"
import { Procurement } from "./procurement"
import { Vendor } from "./vendor"

export type QuotationRequest  = {
    quotationRequestId: string,
    quotationRequestName : string,
    createdAt?: Date,
    createdBy: string,
    updatedBy: string,
    updatedAt?: Date,
    vendors?:  Vendor[],
    vendorIds? : string[],
    procurement? : Procurement,
    procurementId?: string,
    status: string,
    quoteProducts?: string,
    expiryDate : Date,
    
}
import { ProcurementStatus } from "./enums"
import { Quotation } from "./quotation"
import { QuotationRequest } from "./quotationRequest"
import { Product } from '@/types/product'

export type Procurement  = {
    procurementId: string,
    procurementName: string,
    createdBy: string,
    createdAt: Date,
    updatedBy: string,
    updatedAt: Date,
    requestedTo: string,
    confirmedBy: string,
    status: ProcurementStatus,
    volumeDuration: string,
    productsQuantity : {},
    productIds : string[],
    products : Product[],
    quotations : Quotation[],
    quotationsRequests : QuotationRequest[],
    }


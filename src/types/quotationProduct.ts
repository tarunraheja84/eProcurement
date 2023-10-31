import { Quotation } from "./quotation"
import { Product } from '@/types/product'

export type QuotationProduct  = {
    quotationProductId : string
    supplierPrice : number
    requestedQty : number
    acceptedQty : number
    quotationId : string
    productId : string
    quotation : Quotation
    product : Product
}
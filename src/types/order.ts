import { Taxes } from "./product"
import { Quotation } from "./quotation"
import { Vendor } from "./vendor"
import { Product } from '@/types/product'

export type Order  = {
    orderId? : string,
    createdBy?: string,
    createdAt?: Date,
    updatedBy?: string,
    updatedAt?: Date,
    status : string,
    totalAmount : number,
    totalTax : number,
    total : number,
    vendor? : Vendor,
    vendorId : string,
    deliveryAddress : string,
    quotationId : string,
    quotation? : Quotation,
    orderItems : OrderItem[],
    marketPlaceOrderId : string,
    marketPlaceOrderUrl : string,
}

export type OrderItem = {
    id : string,
    product? : Product | null,
    orderedQty : number,
    totalAmount : number,
    totalTax : number,
    total : number,
    receivedQty : number,
    unitPrice : number,
    taxes? : Taxes,
    isSellerOrderProduct? : boolean | null,
    isAlreadyOrderedProduct? : boolean | null,
    productId :string ,
    productName :string ,
    category :string ,
    categoryId :string ,
    subCategory :string ,
    subCategoryId :string ,
    imgPath :string ,
    sellingPrice :number ,
    packSize :string ,
    acceptedQty : number,
    isSellerAccepted : boolean
}
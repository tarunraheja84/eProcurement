import { OrderStatus } from "@prisma/client"
import { Taxes } from "./product"
import { Quotation } from "./quotation"
import { DeliveryAddressMap } from "./sellerOrder"
import { Vendor } from "./vendor"

export type Order  = {
    orderId? : string,
    createdBy?: string,
    createdAt?: Date,
    updatedBy?: string,
    updatedAt?: Date,
    status : OrderStatus,
    totalAmount : number,
    totalTax : number,
    total : number,
    vendor? : Vendor,
    vendorId : string,
    deliveryAddress : DeliveryAddressMap,
    quotationId : string,
    quotation? : Quotation,
    orderItems : OrderItem[],
    marketPlaceOrderId : string,
    marketPlaceOrderUrl : string,
    finalTotalAmount : number,
    finalTotalTax : number,
    finalTotal : number
}

export type OrderItem = {
    id : string,
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
    sellerProductId :string ,
}
import { Order, OrderItem } from "./order";
import { Vendor } from "./vendor";

export type Invoice  = {
    invoiceId?: string,
    invoiceNumber: string,
    createdBy?: string,
    createdAt?: Date,
    updatedBy?: string,
    updatedAt?: Date,
    invoiceType: string,
    totalAmount: number,
    totalTax: number,
    total: number,
    marketPlaceOrderId: string,
    marketPlaceOrderUrl: string,
    order?: Order,
    orderId: string,
    deliveryAddress: string,
    orderItems: OrderItem[],
    status: string,
    vendorId: string,
    vendor?: Vendor,
    creditNoteInvoiceNo?: string
}
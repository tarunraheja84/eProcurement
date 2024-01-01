import { CxoTransactionStatus, Order, PaymentMethod } from "@prisma/client"

export type CxoTransaction  = {
    cxoTxnId? : string,
    amount : number,
    status : CxoTransactionStatus,
    paymentId? : string,
    currency : string,
    paymentMethod? : PaymentMethod
    orderIds : string[],
    orders? : Order[],
    pgOrderId : string,
    createdAt : Date,
    createdBy : string,
    updatedBy : string,
}
import { PaymentMethod, PaymentStatus, PaymentType } from "@prisma/client"

export type Payment  = {
    id? : string,
    paymentId : string,
    paymentDate : Date,
    amount : number,
    paymentType : PaymentType,
    paymentMethod? : PaymentMethod,
    status : PaymentStatus,
    createdBy : string,
    updatedBy : string,
    createdAt? : Date ,
    updatedAt? : Date ,
}
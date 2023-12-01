export enum OrderDeliveryStatus {
    SELLER_MARKED_DELIVERED = "SELLER_MARKED_DELIVERED",
    BUYER_MARKED_DELIVERED = "BUYER_MARKED_DELIVERED",
    SYSTEM_MARKED_DELIVERED = "SYSTEM_MARKED_DELIVERED",
    PORTAL_MARKED_DELIVERED = "PORTAL_MARKED_DELIVERED",
    DELIVERY_APP_MARKED_DELIVERED = "DELIVERY_APP_MARKED_DELIVERED",
    UNKNOWN = "UNKNOWN",
}

export enum OrderStatus {
    CANCELLED = "CANCELLED" , PENDING = "PENDING", CONFIRMED = "CONFIRMED", DELIVERED = "DELIVERED", EXPIRED ="EXPIRED"
}

export enum PaymentStatusType { NONE = "NONE", CREATED = "CREATED", AUTHORIZED = "AUTHORIZED", CAPTURED = "CAPTURED", TRANSFERRED = "TRANSFERRED", REFUNDED = "REFUNDED", SETTLED = "SETTLED" , CHECKED = "CHECKED" }

export type PaymentDetail = {
    paymentId: string;
    status: PaymentStatusType;
    totalAmountPaid: number;
    xfer_id?: string;
    xfrAmount?: number;
    settlementId?: string;
    paymentType?: string;
    pointsUsed?: number;
    paymentDate: Date;
}

export enum DeliveredStatus { REJECT = "REJECT", SHORT = "SHORT", RECEIVED = "RECEIVED" };

import { OrderDeliveryStatus, OrderStatus, PaymentDetail, PaymentStatusType } from "./sellerOrdersEnums";

interface DeliveryAddressMap{
    addressLine:string;
    city: string;
    country: string;
    pinCode: string;
    state: string
}

export class SellerOrder {
    buyerId: string;
    buyerOrderId?: string;
    buyerStoreId: string;
    cancellationDate: Date;
    contractId?: string;
    ratingId?: string;
    createdDate: Date;
    deliveryAddress?: string;
    deliveryAddressMap?: DeliveryAddressMap;
    deliveryCharges?: number;
    deliveryDate: Date;
    deliveryGSTRate?: number;
    deliverySlotEndTime: Date;
    deliverySlotStartTime: Date;
    finalPlatformFee?: number| null;
    finalRedbasilDeliveryCharge?: number;
    finalRedbasilDeliveryChargeGST?: number;
    finalSellerServiceCharge?: number;
    finalTotalAmount?: number| null;
    finalServiceCharge?: number;
    finalTotalTax?: number | null;
    buyerNotes?: string;
    serviceCharge?: number;
    gstInfo?: GstInfo;
    isContractedOrder?: boolean;
    orderDate: Date;
    orderItems: Array<SellerOrderItems>;
    outletName?: string;
    paymentDueDate: Date;
    paymentOverdueDate?: Date;
    paymentReceivedDate: Date;
    paymentStatus: PaymentStatusType;
    pgTransferIdList?: Array<string>;
    platformFee?: number;
    position: {
        geohash: string;
        latitude : number;
        longitude : number;
    }
    redbasilCredit?: Map<string, any>;
    orderDeliveryStatus?: OrderDeliveryStatus;
    redbasilDeliveryCharge?: number;
    redbasilDeliveryChargeGST?: number;
    redbasilDeliveryRate?: number;
    sellerBusinessName: string;
    sellerId: string;
    sellerOrderId?: string;
    sellerServiceCharge?: number | null;
    status: OrderStatus;
    statusNotes?: string;
    totalAmount: number;
    paymentDetails?: Array<PaymentDetail>;
    totalTax: number;
    pgOrderId?: string;
    paymentId?: string;
    pgTransferId?: string;
    refundDetails?: Map<string, number>;
    pointsEarned?: Array<Map<string, any>>;
    isDeliveryReceiptPresent : boolean;
    isDeliveryVerified : boolean;

    constructor(
        buyerId: string,
        buyerStoreId: string,
        cancellationDate: Date,
        createdDate: Date,
        deliveryDate: Date,
        deliverySlotEndTime: Date,
        deliverySlotStartTime: Date,
        orderDate: Date,
        orderItems: Array<SellerOrderItems>,
        paymentDueDate: Date,
        paymentOverdueDate: Date,
        paymentReceivedDate: Date,
        paymentStatus: PaymentStatusType,
        pgTransferIdList: Array<string>,
        position: Position,
        sellerBusinessName: string,
        sellerId: string,
        status: OrderStatus,
        totalAmount: number,
        paymentDetails: Array<PaymentDetail>,
        totalTax: number,
        isDeliveryReceiptPresent : boolean,
        isDeliveryVerified : boolean,
    ) {
        this.buyerId = buyerId;
        this.buyerStoreId = buyerStoreId;
        this.cancellationDate = cancellationDate;
        this.createdDate = createdDate;
        this.deliveryDate = deliveryDate;
        this.deliverySlotEndTime = deliverySlotEndTime;
        this.deliverySlotStartTime = deliverySlotStartTime;
        this.orderDate = orderDate;
        this.orderItems = orderItems;
        this.paymentDueDate = paymentDueDate;
        this.paymentOverdueDate = paymentOverdueDate;
        this.paymentReceivedDate = paymentReceivedDate;
        this.paymentStatus = paymentStatus;
        this.pgTransferIdList = pgTransferIdList;
        this.position = position;
        this.sellerBusinessName = sellerBusinessName;
        this.sellerId = sellerId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.paymentDetails = paymentDetails;
        this.totalTax = totalTax;
        this.isDeliveryReceiptPresent = isDeliveryReceiptPresent;
        this.isDeliveryVerified = isDeliveryVerified;
    }

}

interface Position{
    geohash: string
    latitude: number
    longitude: number
}

interface Specs{
    characteristic: string | null | undefined
    size : string | null | undefined
}

export interface GstInfo{
    billingAddress: string | null | undefined
    gstin: string | null | undefined
    state: string | null | undefined
}

interface Gst{
    finalCharge: number | null | undefined
    initialCharge: number | null | undefined
    rate: number | null | undefined
}

interface OrderItems{
    acceptedQuantity : number | null | undefined
    categoryId :string
    categoryName:string   
    deliveredStatus: string
    finalSellerServiceCharge: number | null | undefined
    imagePath: [string]
    initialSellerServiceCharge: number | null | undefined
    orderedQuantity: number
    packSize:string
    gstCharges : number | null | undefined
    productId:string
    productName:string
    receivedQuantity: number | null | undefined
    rejectedQuantity: number | null | undefined
    sellerAccepted: boolean
    sellerProductId:string
    sellerProductImage: string | null | undefined
    sellerServiceFeeRate: number | null | undefined
    specs: Specs
    subcategoryId:string
    subcategoryName:string
    taxes: Taxes
    unitPrice: number | null | undefined
}



export type SellerOrderItems = {
    sellerProductId: string;
    productId: string;
    productName: string;
    sellerProductImage?: string;
    specs? : Specs | null;
    orderedQuantity: number;
    unitPrice: number;
    fulfillmentAck? : boolean;
    receivedQuantity?: number | null;
    rejectedQuantity?: number | null;
    acceptedQuantity?: number | null;
    packSize: string;
    sellerAccepted: boolean;
    comments?: string;
    imagePath? : string[];
    contractId?: string | null;
    notes?: string | null;
    categoryId: string;
    categoryName: string;
    subcategoryId: string;
    subcategoryName: string;
    gstApplicable?: number;
    gstCharges?: number;
    initialGstCharges?: number;
    sellerServiceFeeRate?: number;
    initialSellerServiceCharge?: number;
    finalSellerServiceCharge?: number;
    taxes?: Taxes | null;
}

export type Taxes = {
    igst?: TaxField | null;
    cgst?: TaxField | null;
    sgst?: TaxField | null;
    cess?: TaxField | null;
}

export type TaxField = {
    rate: number;
    initialCharge: number;
    finalCharge?: number; 
}

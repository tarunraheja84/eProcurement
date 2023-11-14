export enum VendorStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
}

export enum VendorUserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
}

export enum QuotationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
}

export enum QuotationRequestStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    VOID = "VOID",
    EXPIRED = "EXPIRED",
}

export enum OrderStatus {
    PENDING = "PENDING",
}

export enum DeliveredStatus { REJECT = "REJECT", SHORT = "SHORT", RECEIVED = "RECEIVED" };

export enum ProcurementStatus{
    DRAFT="DRAFT",
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE",
    AWAITING_APPROVAL="AWAITING_APPROVAL"
  }
  
export enum VolumeDuration{
    weekly="weekly",
    daily="daily"
  }

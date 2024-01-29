import { VendorStatus } from "@prisma/client";

export type Vendor = {
    vendorId?: string,
    businessName: string,
    businessBrandName?: string | null,
    gstin?: string | null,
    pan: string,
    addressLine: string,
    pinCode: string,
    city: string,
    state: string,
    countryCode?: string,
    phoneNumber: string,
    status: VendorStatus,
    createdAt?: Date,
    createdBy: string,
    updatedBy?: string,
    updatedAt?: Date,
    pgAccountId? : string
}


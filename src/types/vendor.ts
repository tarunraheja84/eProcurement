import { VendorStatus } from "./enums"

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
    status: string,
    createdAt?: Date,
    createdBy: string,
    updatedBy?: string,
    updatedAt?: Date,
}


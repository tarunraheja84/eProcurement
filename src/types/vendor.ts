import { VendorStatus } from "./enums"

export type Vendor  = {
    vendorId: string,
    businessName: string,
    businessBrandName: string,
    gstin: string,
    pan: string,
    addressLine: string,
    pinCode: string,
    city: string,
    state: string,
    countryCode: string,
    phoneNumber: String,
    status: VendorStatus,
    createdAt: Date,
    createdBy: string,
    updatedBy: string,
    updatedAt: Date,
}


import { VendorUserRole } from "./enums";
import { Vendor } from "./vendor";

export type VendorUser  = {
    userId?: string,
    name?: string,
    email: string,
    role: VendorUserRole,
    phoneNumber?: string,
    vendor?: Vendor
    vendorId?: string,
    createdAt?: Date,
    createdBy: string,
    updatedBy?: string,
    updatedAt?: Date,
}



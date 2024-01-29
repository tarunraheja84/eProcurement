import { UserRole, UserStatus } from "@prisma/client";
import { Vendor } from "./vendor";

export type User  = {
    userId?: string,
    name: string,
    email: string,
    role: UserRole,
    status?: UserStatus,
    phoneNumber?: string,
    vendor?: Vendor
    vendorId?: string,
    createdBy?: string,
    createdAt: Date,
    updatedBy?: string,
    updatedAt: Date,
}



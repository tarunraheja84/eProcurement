import { UserRole } from "./enums";

export type User  = {
    userId?: string,
    name?: string,
    email: string,
    role: UserRole,
    phoneNumber?: string,
    vendorId?: string,
    createdAt?: Date,
    createdBy: string,
    updatedBy?: string,
    updatedAt?: Date,
}


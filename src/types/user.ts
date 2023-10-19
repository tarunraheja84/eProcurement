import { UserRole } from "./enums";
import { Vendor } from "./vendor";

export type User  = {
    userId?: string | null;
    name?: string | null;
    email: string;
    role: UserRole;
    phoneNumber?: string | null;
    vendor? : Vendor;
    vendorId?: string | null;
    createdAt : Date;
    updatedAt : Date;
}



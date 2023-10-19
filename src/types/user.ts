import { UserRole } from "./enums";

export type User  = {
    userId?: string | null;
    name: string | null;
    email: string;
    role: UserRole;
    phoneNumber: string | null;
    vendorId: string | null;
}



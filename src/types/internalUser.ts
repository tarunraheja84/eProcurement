import { InternalUserRole } from "@prisma/client"

export type InternalUser  = {
    name: string,
    email: string,
    role: InternalUserRole,
}
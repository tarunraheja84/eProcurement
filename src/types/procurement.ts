import { ProcurementProduct } from "./procurementProduct"

export type Procurement  = {
    procurementId: string,
    procurementName: string,
    createdBy: string,
    createdAt: Date,
    updatedBy: string,
    updatedAt: Date,
    requestedTo: string,
    confirmedBy: string,
    status: string
    procurementProducts?: ProcurementProduct[],
    volumeDuration: string
    }


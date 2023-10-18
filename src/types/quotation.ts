export type Quotation  = {
    quotationId: string,
    createdAt: string,
    createdBy: string,
    updatedBy: string,
    updatedAt: string,
    quotationName: string,
    vendors: string[],
    procurementId: string,
    total: string,
    amount: string,
    totalTax: string,
    status: string,
    quoteProducts: string
}
import { ProcurementProduct } from "@prisma/client";
import { QuotationProduct } from "./quotationProduct";

export type Product  = {
    id : string;
    productId : string;
    productName : string;
    category : string;
    categoryId : string;
    subCategory : string;
    subCategoryId : string;
    imgPath : string;
    quantity?: number | undefined,
    sellingPrice : number;
    packSize : number;
    taxes : Taxes
    procurementProducts : ProcurementProduct
    quotationProducts : QuotationProduct
}

export type Taxes = {
    igst? : number;
    cgst? : number;
    sgst? : number;
    cess? : number;
}

export type Product  = {
    id? : string;
    productId : string;
    productName : string;
    category : string;
    categoryId : string;
    subCategory : string;
    subCategoryId : string;
    imgPath : string;
    quantity?: number | undefined,
    sellingPrice : number;
    packSize : string;
    taxes? : Taxes
}

export type Taxes = {
    igst? : number;
    cgst? : number;
    sgst? : number;
    cess? : number;
}
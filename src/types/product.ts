
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
    createdAt? : Date;
    updatedAt? : Date;
    createdBy : string;
    updatedBy : string;
    isBasePrice : boolean;
}

export type Taxes = {
    igst? : number;
    cgst? : number;
    sgst? : number;
    cess? : number;
}

export type MarketPlaceProduct = {
    productId: string,
    variantsKey: string,
    subcategoryId: string,
    categoryId: string,
    status:string,
    UOM: string,
    packSize: string,
    name: string,
    brand: string,
    desc: string | null,
    taxes?: Taxes,
    imgPath? : string | null
}
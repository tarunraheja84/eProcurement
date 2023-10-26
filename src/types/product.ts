export type Product  = {
    productId: string,
    productName: string,
    category: string,
    subCategory: string,
    categoryId:string,
    subCategoryId: string,
    imgPath:string,
    quantity: number,
    sellingPrice:number,
    packSize: string
    taxes:{
        igst:number,
        cgst:number,
        sgst:number,
        cess:number
    }
}
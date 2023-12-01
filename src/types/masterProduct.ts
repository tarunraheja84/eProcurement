import { Product } from "./product";

export type MasterProduct= {
    UOM: string;
    brand: string;
    quantity?:number | undefined,
    businessName: string;
    category: string;
    categoryId: string;
    categoryStatus: string;
    contractedBuyers: any[]; // You can specify the actual type if you have it
    distinctName: string;
    imgPath: string;
    localities: string[];
    name: string;
    nameSuffixes: string[];
    objectID: string;
    otherSellers: string[];
    packSize: string;
    packSizeVariants:any;
    selectedSellerProductId:string,
    selectedPrice:number,
    prefLocalities: string[];
    productId: string;
    productStatus: string;
    productType: string;
    sellerId: string;
    sellerProductId:string,
    sellerImgPath: string | null;
    sellingPrice: number;
    source: string;
    status: string;
    subcategory: string;
    subcategoryId: string;
    subcategoryStatus: string;
    supportedPinCodes: number[];
    variantPrices: any; // You can specify the actual type if you have it
    variantsKey: string;
    taxes:any
    _geoloc: { lat: number; lng: number }[];
    productMap:Map<string, Product>
    _highlightResult: {
        brand: {
            matchLevel: string;
            matchedWords: string[];
            value: string;
        };
        name: {
            fullyHighlighted: boolean;
            matchLevel: string;
            matchedWords: string[];
            value: string;
        };
        nameSuffixes: {
            value: string;
            matchLevel: string;
            matchedWords: string[];
        }[];
        packSize: {
            matchLevel: string;
            matchedWords: string[];
            value: string;
        };
    };
}



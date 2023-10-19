export type MasterProduct= {
    UOM: string;
    brand: string;
    quantity?:number,
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
    productIdMap: any; // You can specify the actual type if you have it
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
    _geoloc: { lat: number; lng: number }[];
    productQuantityMap:Map<string, number>
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



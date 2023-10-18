export const getHostedImageUrl = async (relativeImageUrl: string) => {
    const encoded = encodeURIComponent(relativeImageUrl);

    const res = `https://${process.env.NEXT_PUBLIC_FIREBASE_CONFIG_PROJECT_ID}.web.app/${encoded}`;
    
    return res;
}

export const getProductImgPath = async (prd:string) => {
    var path = `img/master/products/${prd}.jpg`;
    return await getHostedImageUrl(path);
}

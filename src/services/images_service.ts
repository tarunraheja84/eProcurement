
export const getProductImgPath = (prd:string) => {
    var path = `img/master/products/${prd}.jpg`;
    const encoded = encodeURIComponent(path);
    const res = `https://${process.env.NEXT_PUBLIC_GCP_CONFIG_PROJECT_ID}.web.app/${encoded}`;
    return res;
}

import {getSearchResults } from "../../../services/search_service";
import { getProductImgPath } from "../../../services/storage_service";


export async function POST(req: Request) {
    
    try{      
        const {query} =await req.json();
        const result = await getSearchResults(query, 0)
        for(const product of result.hits){
            product.imgPath=await getProductImgPath(product.name);
        }
        return new Response(JSON.stringify(result), {status:200});
    }catch(error:any){
        return new Response(error, {status:400});
    }
}
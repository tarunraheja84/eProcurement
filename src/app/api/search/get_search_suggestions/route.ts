import { getSearchSuggestions } from "@/services/search_service";


export async function POST(req: Request) {
    
    try{      
        const {query} =await req.json();
        const result = await getSearchSuggestions(query);
        return new Response(JSON.stringify(result), {status:200});
    }catch(error:any){
        return new Response(error);
    }
}
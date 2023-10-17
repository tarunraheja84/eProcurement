import { _getSearchResults } from "../../../../services/search_service";


export async function POST(req: Request) {    
    try{   
        const {term,category} =await req.json();
        const result = await _getSearchResults(term, category, 0);
        return new Response(JSON.stringify(result), {status:200});
    }catch(error:any){
        return new Response(error, {status:400});
    }
}
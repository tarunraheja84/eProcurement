import { accessSecret } from "@/utils/utils";
import algoliasearch from "algoliasearch";

let ALGOLIA_APP_ID = "";
let ALGOLIA_API_KEY = "";

let client: any | undefined; 
let index: any | undefined;

export const initAlgolia = async () => {
  if(client === undefined) {
      ALGOLIA_API_KEY = await accessSecret("ALGOLIA_API_KEY");
      ALGOLIA_APP_ID = await accessSecret("ALGOLIA_APPLICATIONID");
        client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  }
}

export const getSearchSuggestions = async (query: string) => {
  try{
    await initAlgolia();
    index = undefined;
    index = await client.initIndex("products_query_suggestions");
    const products= await accessSecret("ALGOLIA_INDEX_NAME");
    const aQuery = await index.search(query);
    aQuery.products=products;
    // Get Result/Objects
    return aQuery;
  }catch(error:any){
    console.log(error);
  }
}

export const getSearchResults = async (query:string,page:number) => { 
    let filters:string=`sellerId:"ZJjgm0UmDjmVtWgU2srM"`;
    filters =filters + ' AND (productStatus:"published")';

    await initAlgolia();
    index = undefined;
    const products= await accessSecret("ALGOLIA_INDEX_NAME");
    index = await client.initIndex(products);
    let aQuery:any = {};
    aQuery.filters=filters;  

    aQuery.page=page;
    let res = await index.search(query, aQuery);
    return res;
}

export const _getSearchResults = async (term: string | undefined, category:string,page:number) => {

  let filters:string=`${'category'}:"${category}"`;
  filters =filters + ' AND (productStatus:"published")';
  filters = filters + ` AND (sellerId:"ZJjgm0UmDjmVtWgU2srM")`;
  
  await initAlgolia();
  index = undefined;
  const products= await accessSecret("ALGOLIA_INDEX_NAME");
  index = await client.initIndex(products);
  let aQuery:any = {};

  aQuery.page=page;
  aQuery.filters=filters;
  let res = await index.search(term, aQuery);
  return res;
  
}
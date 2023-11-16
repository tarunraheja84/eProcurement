import { accessSecret } from "@/utils/utils";
import algoliasearch from "algoliasearch";

let client: any | undefined; 
let index: any | undefined;

export const initAlgolia = async () => {
  const credentials = await Promise.all([
    accessSecret("ALGOLIA_API_KEY"),
    accessSecret("ALGOLIA_APPLICATIONID")
  ])
  const [ALGOLIA_API_KEY, ALGOLIA_APP_ID] = credentials;
  client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
}

export const getSearchSuggestions = async (query: string) => {
  try{
    await initAlgolia();
    index = undefined;
    index = await client.initIndex("products_query_suggestions");
    const aQuery = await index.search(query);
    // Get Result/Objects
    return aQuery;
  }catch(error:any){
    console.log(error);
  }
}

export const getSearchResults = async (query:string,page:number) => { 
    let filters:string=`sellerId:\"${process.env.SELLER_ID}\"`;
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
  filters = filters + ` AND (sellerId:\"${process.env.NEXT_PUBLIC_SELLER_ID}\")`;

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
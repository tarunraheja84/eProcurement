import { accessSecretVersion } from "./secret_manager";
import algoliasearch from "algoliasearch";

let ALGOLIA_APP_ID = "";
let ALGOLIA_API_KEY = "";

let client: any | undefined; 
let index: any | undefined;

export const initAlgolia = async () => {
  if(client === undefined) {
      ALGOLIA_API_KEY = await accessSecretVersion("ALGOLIA_API_KEY");
      ALGOLIA_APP_ID = await accessSecretVersion("ALGOLIA_APPLICATIONID");
        client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  }
}

export const getSearchSuggestions = async (query: string) => {
    await initAlgolia();
    index = undefined;
    index = await client.initIndex("products_query_suggestions");
    const aQuery = await index.search(query);
    // Get Result/Objects
    return aQuery;
}

export const getSearchResults = async (query:string,page:number) => {    
    await initAlgolia();
    index = undefined;
    index = await client.initIndex('products');
    let aQuery:any = {};

    aQuery.page=page;
    let res = await index.search(query, aQuery);
    return res;
}

export const _getSearchResults = async (term: string | undefined, category:string,page:number) => {

  let filters:string=`${'category'}:"${category}"`;
  filters =filters + ' AND (productStatus:"published")'
  
  await initAlgolia();
  index = undefined;
  index = await client.initIndex('products');
  let aQuery:any = {};

  aQuery.page=page;
  aQuery.filters=filters;
  let res = await index.search(term, aQuery);
  return res;
  
}
import fs from "fs"


export const getSearchSuggestions = async (query: string) => {
  try {
    const data: any = await fs.promises.readFile(`src/products/${query}_suggestions.txt`, 'utf-8')
    const aQuery = JSON.parse(data);
    return aQuery;
  } catch (error: any) {
    console.log('error  :>> ', error);
  }
}

export const getSearchResults = async (query: string, page: number) => {
  try {
    const data: any = await fs.promises.readFile(`src/products/${query[0]==='a' ? "apple" : "banana"}_results.txt`, 'utf-8')
    const res = JSON.parse(data);
    return res;
  } catch (error: any) {
    console.log('error  :>> ', error);
  }
}

export const _getSearchResults = async (term: string | undefined, category: string, page: number) => {
  try {
    const data: any = await fs.promises.readFile(`src/products/${term},${category}_results.txt`, 'utf-8')
    const res = JSON.parse(data);
    return res;
  } catch (error: any) {
    console.log('error  :>> ', error);
  }
}
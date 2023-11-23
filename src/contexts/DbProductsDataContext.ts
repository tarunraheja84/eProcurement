import  { createContext } from 'react';

type DbProductData= {
    procurementId:string,
    productsQuantity:Object
}

type DbProductsDataType = {
    dbProductsData:DbProductData[]
    setDbProductsData: Function
  };

export const DbProductsDataContext = createContext<DbProductsDataType>({dbProductsData:[], setDbProductsData:()=>{}})



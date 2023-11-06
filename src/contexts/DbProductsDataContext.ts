import  { createContext } from 'react';

type DbProductIdsType = {
    dbProductsData:any[];
    setDbProductsData: Function
  };

export const DbProductsDataContext = createContext<DbProductIdsType>({dbProductsData:[], setDbProductsData:()=>{}})



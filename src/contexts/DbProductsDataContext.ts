import  { createContext } from 'react';

type DbProductIdsType = {
    dbProductsData:any[]
    //it contains dynamic object fields, it has to be defined any
    setDbProductsData: Function
  };

export const DbProductsDataContext = createContext<DbProductIdsType>({dbProductsData:[], setDbProductsData:()=>{}})



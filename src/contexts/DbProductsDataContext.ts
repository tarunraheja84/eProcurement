import  { createContext } from 'react';

type DbProductsDataType = {
    dbProductsData:any[]
    //it contains dynamic object fields, it has to be defined any
    setDbProductsData: Function
  };

export const DbProductsDataContext = createContext<DbProductsDataType>({dbProductsData:[], setDbProductsData:()=>{}})



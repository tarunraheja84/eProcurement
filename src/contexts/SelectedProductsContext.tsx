import { Product } from '@/types/product';
import  { createContext } from 'react';

type SelectedProductsType = {
  selectedProducts: Map<string,Product>;
  setSelectedProducts: Function
};

export const SelectedProductsContext = createContext<SelectedProductsType>({selectedProducts:new Map<string,Product>, setSelectedProducts:()=>{}})




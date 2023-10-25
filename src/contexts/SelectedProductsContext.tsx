import { Product } from '@/types/product';
import  { ReactNode, createContext } from 'react';

type SelectedProductsType = {
  selectedProducts: Map<string,Product>;
};

export const SelectedProductsContext = createContext<SelectedProductsType>({selectedProducts:new Map<string,Product>})

export const SelectedProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const selectedProducts = new Map<string,Product>;
  return (
    <SelectedProductsContext.Provider value={{ selectedProducts}}>
      {children}
    </SelectedProductsContext.Provider>
  );
};



"use client"
import NavBar from '@/components/navbar';
import { DbProductsDataContext } from '@/contexts/DbProductsDataContext';
import { ManagersContext } from '@/contexts/ManagersContext';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { Product } from '@/types/product';
import { useState } from 'react';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const [selectedProducts, setSelectedProducts] = useState(new Map<string, Product>);
    const [dbProductsData, setDbProductsData] = useState([]);
    const [managers, setManagers]= useState([]);
  return (
      <SelectedProductsContext.Provider value={{selectedProducts,setSelectedProducts}}>
        <DbProductsDataContext.Provider value={{dbProductsData, setDbProductsData}}>
          <ManagersContext.Provider value={{managers, setManagers}}>
              <div className='page-container'>
                {children}
              </div>
            </ManagersContext.Provider>
        </DbProductsDataContext.Provider>
    </SelectedProductsContext.Provider>
  )
}

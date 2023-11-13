"use client"
import React, { useState } from 'react'
import ProcurementForm from '@/components/procurementForm'
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext'
import { Product } from '@/types/product'
import { DbProductsDataContext } from '@/contexts/DbProductsDataContext'


const page = () => {
  const [selectedProducts, setSelectedProducts] = useState(new Map<string, Product>);
  const [dbProductsData, setDbProductsData] = useState([]);
  return (
    <SelectedProductsContext.Provider value={{selectedProducts,setSelectedProducts}}>
      <DbProductsDataContext.Provider value={{dbProductsData, setDbProductsData}}>
      <ProcurementForm />
      </DbProductsDataContext.Provider>
    </SelectedProductsContext.Provider>
  )
}

export default page


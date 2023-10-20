import { MasterProduct } from '@/types/masterProduct'
import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

interface Props {
  selectedProducts:MasterProduct[]
}

const SelectedProducts = ({selectedProducts}:Props) => {
  const [products, setProducts]=useState<MasterProduct[]>([]);

  useEffect(()=>{
    setProducts(selectedProducts);
  },[selectedProducts])
  
  const isSelected=(product:MasterProduct)=>{
    // if(!selectedProducts.includes(product))
    // selectedProducts.push(product);
  }

  const removeProduct=(product:MasterProduct)=>{
    // if(selectedProducts.includes(product))
    // selectedProducts.pop();
  }
  return (
    <div>
      {products.length>0 && <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] overflow-y-auto">
        {
          products.map((product: MasterProduct,index:number) => {
            return (
              <ProductCard key={index} product={product} setProducts={setProducts} isSelected={isSelected} removeProduct={removeProduct}/>)          
            })
          }
          </div>
      }
    </div>
  )
}

export default SelectedProducts

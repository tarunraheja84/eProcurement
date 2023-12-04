import React, { useContext, useEffect, useState } from 'react'
import { Product } from '@/types/product'
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext'
import ProductDeleteIcon from '@/svg/ProductDeleteIcon';


const SelectedProducts = () => {
  const { selectedProducts, setSelectedProducts } = useContext(SelectedProductsContext);
  
  return (
    <>
      {selectedProducts.size > 0 &&
        <div>
          <div className="flex justify-between">
            <h2 className="md:text-2xl mb-4">Selected Products</h2>
            <div className="text-sm md:text-base">Total Products Selected: {selectedProducts.size}</div>
          </div>
          <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
            {
              Array.from(selectedProducts.values()).map((product: Product, index: number) => {
                return product && (
                  <div key={index} className='relative flex flex-col bg-white m-2 border rounded border-custom-gray-3'>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <div className="flex flex-col md:flex-row ml-2 md:ml-0 justify-start items-center md:gap-4">
                        <div className='flex flex-row'>
                          <img src={product.imgPath} className=' w-14 h-14 border rounded md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                          <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                            <div className='text-sm md:text-base font-semibold'>{product.productName}</div>
                          </div>
                        </div>
                        <div>
                          <div className='text-sm md:text-base font-semibold'>Category: <span className="text-custom-blue">{product.category}</span></div>
                          <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-custom-pink">{product.subCategory}</span></div>
                          <div className='text-sm md:text-base font-semibold'>Selling Price: <span className="text-custom-red">₹{product.sellingPrice}</span></div>
                        </div>
                      </div>
                      <div className="md:absolute top-0 right-0 cursor-pointer" 
                            onClick={()=>{
                                            selectedProducts.delete(product.productId);
                                            setSelectedProducts(new Map(selectedProducts));
                                            }}>
                      <ProductDeleteIcon />
                      </div>
                    </div>
                    <div className="flex m-2">
                      <div className='border md:w-[145px] flex justify-center items-center pl-[10px] rounded-md focus:outline-none w-full' >
                        {product.packSize}
                      </div>
                      <div className='flex flex-row justify-end mx-2'>
                        <QuantityButton product={product} />
                      </div>
                      <div className="md:absolute top-0 right-0 m-2"></div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      }
    </>
  )
}

export default SelectedProducts

interface QuantityProps {
  product: Product
}

const QuantityButton = ({ product }: QuantityProps) => {
  const [value, setValue] = useState<number | undefined>(product.quantity);
  const {selectedProducts, setSelectedProducts}= useContext(SelectedProductsContext);

  useEffect(()=>{
    setValue(product.quantity)
  },[product.quantity])
  
  const selectProduct = (productId: string, product: Product) => {
    selectedProducts.set(productId, product);
    setSelectedProducts(new Map(selectedProducts));
}

const removeProduct = (productId: string) => {
    selectedProducts.delete(productId);
    setSelectedProducts(new Map(selectedProducts));
}

  return (
    <>
      {value || value===undefined ? (
        // undefined is allowed but 0 is not allowed
        <div
          className="w-[8.125rem] h-[37.5px] flex border border-custom-red"
        >
          <div
            className="h-[36px] w-[28px] bg-custom-red bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              if(typeof(value)=== "number"){
                product.quantity=value-1;
                if(!product.quantity)
                  removeProduct(product.productId);
                setValue(value - 1);
              }
            }}
          >
            <div className="text-custom-red">-</div>
          </div>
          <div className="w-[74px] flex justify-center items-center ">
            <input
              type="number"
              className="w-full h-full text-center outline-none text-custom-red"
              onChange={(e) => {

                if (!e.target.value) {
                  setValue(undefined);
                }
                else {
                  product.quantity=parseInt(e.target.value);
                  setValue(parseInt(e.target.value));
                }
              }}
              value={value}
              required
            />
          </div>
          <div
            className="h-[36px] w-[28px] bg-custom-red bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              if(typeof(value)=== "number"){
                product.quantity=value+1;
                selectProduct(product.productId, product);
                setValue(value + 1);
              }
            }}
          >
            <div className="text-custom-red">+</div>
          </div>
        </div>

      ) : (
        <div
          onClick={() => {
            if(typeof(value)=== "number"){
              product.quantity=value+1;
              selectProduct(product.productId, product);
              setValue(value + 1);
            }
          }}
          className="bg-custom-red text-white border text-xs md:text-base px-4 ml-1 mr-1 h-9 w-28 flex items-center justify-center"
        >
          Add
        </div>
      )}
    </>
  );
};



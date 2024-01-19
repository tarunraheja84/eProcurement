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
                          <div className='text-sm md:text-base font-semibold'>Selling Price: <span className="text-custom-theme">₹{product.sellingPrice}</span></div>
                        </div>
                      </div>
                      <div className="md:absolute top-0 right-0 cursor-pointer" 
                            onClick={()=>{
                              console.log("clicked")
                                            selectedProducts.delete(product.sellerProductId);
                                            setSelectedProducts(new Map(selectedProducts));
                                            }}>
                      <ProductDeleteIcon />
                      </div>
                    </div>
                    <div className="md:flex m-2">
                      <div className='border md:w-32 flex justify-center items-center pl-2 rounded-md focus:outline-none w-full' >
                        {product.packSize}
                      </div>
                      <div className='flex mx-2 my-2 md:my-0'>
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
          className="md:w-32 h-9 flex border border-custom-theme"
        >
          <div
            className="h-9 w-8 bg-custom-theme bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              if(typeof(value)=== "number"){
                product.quantity=value-1;
                if(!product.quantity)
                  removeProduct(product.sellerProductId);
                setValue(value - 1);
              }
            }}
          >
            <div className="text-custom-theme">-</div>
          </div>
          <div className="w-20 flex justify-center items-center ">
            <input
              type="number"
              className="w-full h-full text-center outline-none text-custom-theme"
              onChange={(e) => {

                if (!e.target.value) {
                  setValue(undefined);
                }
                else {
                  product.quantity=Number(e.target.value);
                  setValue(Number(e.target.value));
                }
              }}
              value={value}
              required
            />
          </div>
          <div
            className="h-9 w-8 bg-custom-theme bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              if(typeof(value)=== "number"){
                product.quantity=value+1;
                selectProduct(product.sellerProductId, product);
                setValue(value + 1);
              }
            }}
          >
            <div className="text-custom-theme">+</div>
          </div>
        </div>

      ) : (
        <div
          onClick={() => {
            if(typeof(value)=== "number"){
              product.quantity=value+1;
              selectProduct(product.sellerProductId, product);
              setValue(value + 1);
            }
          }}
          className="md:w-32 h-9 mx-2 my-2 md:my-0 flex border border-custom-theme bg-custom-theme text-white text-xs md:text-base items-center justify-center cursor-pointer"
        >
          Add
        </div>
      )}
    </>
  );
};



import React, { useContext, useEffect, useState } from 'react'
import { Product } from '@/types/product'
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext'


const SelectedProducts = () => {
  const { selectedProducts } = useContext(SelectedProductsContext);
  const [selectedProductsSize, setSelectedProductsSize] = useState(selectedProducts.size);
  

  const isSelected = (productId: string, product: Product) => {
    if (!selectedProducts.has(productId)) {
      selectedProducts.set(productId, product);
    }
    setSelectedProductsSize(selectedProducts.size)
  }

  const removeProduct = (productId: string) => {
    if (selectedProducts.has(productId)) {
      selectedProducts.delete(productId);
    }
    setSelectedProductsSize(selectedProducts.size)
  }

  return (
    <>
      {selectedProducts.size > 0 &&
        <div>
          <div className="flex justify-between">
            <h2 className="md:text-2xl mb-4">Selected Products</h2>
            <div className="text-sm md:text-base">Total Products Selected: {selectedProductsSize}</div>
          </div>
          <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
            {
              Array.from(selectedProducts.values()).map((product: Product, index: number) => {
                return product && (
                  <div key={index} className='relative flex flex-col bg-white m-2 border rounded border-gray-400'>
                    <div className='flex flex-row justify-between items-center w-full'>
                      <div className="flex flex-col md:flex-row ml-2 md:ml-0 justify-start items-center md:gap-4">
                        <div className='flex flex-row'>
                          <img src={product.imgPath} className=' w-14 h-14 border rounded border-grey md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                          <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                            <div className='text-sm md:text-base font-semibold'>{product.productName}</div>
                          </div>
                        </div>
                        <div>
                          <div className='text-sm md:text-base font-semibold'>Category: <span className="text-blue-400">{product.category}</span></div>
                          <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-pink-300">{product.subCategory}</span></div>
                          <div className='text-sm md:text-base font-semibold'>Selling Price: <span className="text-custom-red">₹{product.sellingPrice}</span></div>
                        </div>
                      </div>
                      <div className="md:absolute top-0 right-0 cursor-pointer" onClick={()=>{removeProduct(product.productId)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="#f1807e" />
                          <line x1="30" y1="30" x2="70" y2="70" stroke="white" stroke-width="6" />
                          <line x1="30" y1="70" x2="70" y2="30" stroke="white" stroke-width="6" />
                      </svg>
                      </div>
                    </div>
                    <div className="flex m-2">
                      <div className='border md:w-[145px] flex justify-center items-center pl-[10px] rounded-md focus:outline-none w-full' >
                        {product.packSize}
                      </div>
                      <div className='flex flex-row justify-end mx-2'>
                        <QuantityButton product={product} isSelected={isSelected} removeProduct={removeProduct} />
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
  product: Product,
  isSelected: (productId: string, product: Product) => void;
  removeProduct: (productId: string) => void
}

const QuantityButton = ({ product, isSelected, removeProduct }: QuantityProps) => {
  const [value, setValue] = useState<number>(product.quantity);

  useEffect(() => {
    product.quantity = value;

    if (value)
      isSelected(product.productId, product);
    else {
      removeProduct(product.productId);
    }
  }, [value])


  return (
    <>
      {value ? (
        <div
          className="w-[8.125rem] h-[37.5px] flex border border-custom-red"
        >
          <div
            className="h-[36px] w-[28px] bg-custom-red bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              setValue(value - 1);
            }}
          >
            <button className="text-custom-red">-</button>
          </div>
          <div className="w-[74px] flex justify-center items-center ">
            <input
              type="number"
              className="w-full h-full text-center outline-none text-custom-red"
              onChange={(e) => {

                if (e.target.value === "") {
                  setValue(0);
                }
                else {
                  setValue(parseInt(e.target.value));
                }
              }}
              value={value}
            />
          </div>
          <div
            className="h-[36px] w-[28px] bg-custom-red bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              setValue(value + 1);
            }}
          >
            <div className="text-custom-red">+</div>
          </div>
        </div>

      ) : (
        <button
          onClick={() => {
            setValue(value + 1);
          }}
          className="bg-custom-red text-white border text-xs md:text-base px-4 ml-1 mr-1 h-9 w-28 flex items-center justify-center"
        >
          Add
        </button>
      )}
    </>
  );
};



import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import QuantityButton from './QuantityButton';
import { MasterProduct } from '@/types/masterProduct';
import { Product } from '@/types/product';


interface ProductCardProps {
    newProduct: MasterProduct;
    isSelected: (productId: string, product: Product) => void;
    removeProduct: (productId: string) => void
}

const ProductCard = ({ newProduct, isSelected, removeProduct }: ProductCardProps) => {
    const [selectedProductId, setSelectedProductId] = useState(newProduct.productId);


    const updateSelectedProduct = (selectedProductId: string) => {
        setSelectedProductId(selectedProductId);
    }
    return (
        <div className='relative flex flex-col bg-white m-2 border rounded border-gray-400'>
            <div className='flex flex-row justify-between items-center w-full'>
                <div className="flex flex-col md:flex-row ml-2 md:ml-0 justify-start items-center md:gap-4">
                <div className='flex flex-row'>
                    <img src={newProduct.imgPath} className=' w-14 h-14 border rounded border-grey md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                    <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                        <div className='text-sm md:text-base font-semibold'>{newProduct.name}</div>
                    </div>
                </div>
                    <div>
                        <div className='text-sm md:text-base font-semibold'>Category: <span className="text-blue-400">{newProduct.category}</span></div>
                        <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-pink-300">{newProduct.subcategory}</span></div>
                    </div>
                </div>
                <div className="md:absolute top-0 right-0 m-2">₹{newProduct.productMap.get(selectedProductId) ? newProduct.productMap.get(selectedProductId)!.sellingPrice : newProduct.productMap.get(newProduct.productId)!.sellingPrice}
                </div>
            </div>
            <div className="flex m-2">
                <DropDown newProduct={newProduct} updateSelectedProduct={updateSelectedProduct} />
                <div className='flex flex-row justify-end mx-2'>
                    <QuantityButton newProduct={newProduct} selectedProductId={newProduct.productMap.get(selectedProductId) ? selectedProductId : newProduct.productId} isSelected={isSelected} removeProduct={removeProduct} />
                </div>
            </div>
        </div>
    )
}

interface DropDownProps {
    newProduct: MasterProduct;
    updateSelectedProduct: Function,
}


const DropDown = ({ newProduct, updateSelectedProduct }: DropDownProps) => {
    const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
        updateSelectedProduct(e.target.value);
    }
    return (
        <>
            <label htmlFor='drp' className='border w-24 md:w-[145px] flex justify-between pl-[10px] rounded-md' >
                <select className='focus:outline-none w-12 md:w-[145px] cursor-pointer' id='drp' name='drp' onChange={(e) => handleVariantChange(e)}>
                    {
                        Array.from(newProduct.productMap.keys()).map((key) => (
                            <option key={key} id="drp" className="w-12 md:w-[145px]" value={key}>{newProduct.productMap.get(key)!.packSize}</option>
                        ))
                    }
                </select>
            </label>
        </>
    )
}

export default ProductCard
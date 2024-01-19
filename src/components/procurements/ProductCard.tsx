import React, { ChangeEvent, useState } from 'react'
import { MasterProduct } from '@/types/masterProduct';
import QuantityButton from './QuantityButton';

interface ProductCardProps {
    masterProduct: MasterProduct;
}

const ProductCard = ({ masterProduct }: ProductCardProps) => {
    const [selectedProductId, setSelectedProductId] = useState(masterProduct.objectID);

    const updateSelectedProduct = (selectedProductId: string) => {
        setSelectedProductId(selectedProductId);
    }
    return (
        <div className='relative flex flex-col bg-white m-2 border rounded border-custom-gray-3'>
            <div className='flex flex-row justify-between items-center w-full'>
                <div className="flex flex-col md:flex-row ml-2 md:ml-0 justify-start items-center md:gap-4">
                    <div className='flex flex-row'>
                        <img src={masterProduct.imgPath} className=' w-14 h-14 border rounded md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                        <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                            <div className='text-sm md:text-base font-semibold'>{masterProduct.name}</div>
                        </div>
                    </div>
                    <div>
                        <div className='text-sm md:text-base font-semibold'>Category: <span className="text-custom-blue">{masterProduct.category}</span></div>
                        <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-custom-pink">{masterProduct.subcategory}</span></div>
                    </div>
                </div>
                <div className="md:absolute top-0 right-0 m-2">₹{masterProduct.productMap.get(selectedProductId) ? masterProduct.productMap.get(selectedProductId)!.sellingPrice : masterProduct.productMap.get(masterProduct.objectID)?.sellingPrice}
                </div>
            </div>
            <div className="md:flex m-2">
                <DropDown masterProduct={masterProduct} updateSelectedProduct={updateSelectedProduct} />
                <QuantityButton masterProduct={masterProduct} selectedProductId={masterProduct.productMap.get(selectedProductId) ? selectedProductId : masterProduct.objectID} />
            </div>
        </div>
    )
}

interface DropDownProps {
    masterProduct: MasterProduct;
    updateSelectedProduct: Function,
}


const DropDown = ({ masterProduct, updateSelectedProduct }: DropDownProps) => {
    const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
        updateSelectedProduct(e.target.value);
    }
    return (
        <>
            <select className='border md:w-32 h-9 flex justify-center items-center pl-2 rounded-md focus:outline-none w-full cursor-pointer' onChange={(e) => handleVariantChange(e)}>
                {
                    Array.from(masterProduct.productMap.keys()).map((key) => (
                        <option key={key} className="" value={key}>{masterProduct.productMap.get(key)!.packSize}</option>
                    ))
                }
            </select>
        </>
    )
}

export default ProductCard





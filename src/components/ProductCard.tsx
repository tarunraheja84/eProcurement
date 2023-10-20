import React, { ChangeEvent, useEffect, useState } from 'react'
import QuantityButton from './QuantityButton';
import { MasterProduct } from '@/types/masterProduct';


interface ProductCardProps {
    product: MasterProduct;
    setProducts: Function,
    isSelected:(product: MasterProduct) => void,
    removeProduct:(product: MasterProduct) => void
}

const ProductCard = ({product, setProducts, isSelected, removeProduct}: ProductCardProps) => {
    let productQantityMap:Map<string, number> = new Map<string, number>();
    const [selectedProductId, setSelectedProductId]=useState("");
    
    useEffect(() => {
        product.productQuantityMap=productQantityMap;
        if(product.packSizeVariants && product.variantPrices){
            setProducts( (prev: MasterProduct[]) => {
                return prev.map((item: MasterProduct) => {
                    if(item.sellerProductId === product.sellerProductId) {
                        return {...item, packSizeVariants: {...item.packSizeVariants, [(item.productId) as string]: item.packSize}, variantPrices: {...item.variantPrices, [(item.productId) as string] : item.sellingPrice}}
                    }else {
                        return item;
                    }
                })
            });
            product.productQuantityMap.set(Object.keys(product.packSizeVariants)[0],0);
            setSelectedProductId(Object.keys(product.packSizeVariants)[0])
        }
    }, []);
    
    // useEffect(()=>{
    //     if(quantity){
    //         isSelected(product);
    //         product.quantity=quantity;
    //         productQantityMap.set(product.productId,quantity);
    //     }
    //     else{
    //         removeProduct(product);
    //     }
    // },[quantity])

    const updateQuantity=(value:number)=>{
        console.log(selectedProductId)
        if(product.productQuantityMap)
            product.productQuantityMap.set(selectedProductId,value);
    }

    const updateSelectedProductPackSize = (
        selectedProductId: string) => {
            setProducts( (prev: MasterProduct[]) => {
                return prev.map((item: MasterProduct) => {
                    if(item.sellerProductId === product.sellerProductId) {
                        return {...item, selectedSellerProductId: selectedProductId}
                    }else {
                        return item;
                    }
                })
            });
        if (product.sellerProductId === selectedProductId) {
            setProducts( (prev: MasterProduct[]) => {
                return prev.map((item: MasterProduct) => {
                  if(item.sellerProductId === product.sellerProductId) {
                    return {...item, selectedPackSize: item.packSize}
                  }else {
                    return item;
                  }
                })
              });
            
        } else {
            Object.keys(product.packSizeVariants!)!.forEach((element: string) => {
                if (element === selectedProductId) {
                    setProducts( (prev: MasterProduct[]) => {
                        return prev.map((item: MasterProduct, index: number) => {
                          if(item.sellerProductId === product.sellerProductId) {
                            return {...item, selectedPackSize: item.packSizeVariants![element],selectedPrice: item.variantPrices![selectedProductId],  }
                          }else {
                            return item;
                          }
                        })
                      });
                }
            });
        }
        setSelectedProductId(selectedProductId);
        if(!product.productQuantityMap.has(selectedProductId)){
            product.productQuantityMap.set(selectedProductId,0);
        }
    }

    return (
                <div className='relative flex flex-col bg-white m-2 border rounded border-gray-400'>
                    <div className='flex flex-row justify-between items-center w-full'>
                        <div className='flex flex-row'>
                            <img src={product.imgPath} className=' w-14 h-14 border rounded border-grey md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                                <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                                    <div className='text-sm md:text-base font-semibold text-custom-black'>{product.name}</div>
                                </div>
                        </div>
                        <div className="md:absolute top-0 right-0 m-2">₹{selectedProductId?product.variantPrices[selectedProductId]:""}</div>
                    </div>
                    <div className="flex m-2">
                        <DropDown product={product} updateSelectedProductPackSize={updateSelectedProductPackSize} />
                        <div className='flex flex-row justify-end mx-2'>
                            <QuantityButton product={product} selectedProductId={selectedProductId} updateQuantity={updateQuantity}/>
                        </div>
                    </div>
                </div>
    )
}

interface DropDownProps {
    product:MasterProduct;
    updateSelectedProductPackSize: Function
}


const DropDown = ({ product, updateSelectedProductPackSize }: DropDownProps) => {

    const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
        updateSelectedProductPackSize(e.target.value);
    }
    return <>
        {
            product.packSizeVariants &&
                 (
                <label htmlFor='drp' className='border md:w-[145px] flex justify-between pl-[10px] rounded-md' >
                    <select className='focus:outline-none w-full cursor-pointer' id='drp' name='drp' onChange={(e) => handleVariantChange(e)}>
                        {
                            Object.keys(product.packSizeVariants).map((key) => (
                                <option key={key} id="drp" value={key}>{product.packSizeVariants![key]}</option>
                            ))
                        }
                    </select>
                </label>)
        }
    </>

}

export default ProductCard
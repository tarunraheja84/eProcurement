import { SelectedProductsContext } from "@/contexts/SelectedProductsContext";
import { MasterProduct } from "@/types/masterProduct";
import { Product } from "@/types/product";
import React, { useContext, useEffect, useState } from "react";

interface Props{
  newProduct:MasterProduct,
  selectedProductId:string,
  isSelected: (productId: string, product: Product) => void
  removeProduct: (productId: string) => void
}

const QuantityButton = ({newProduct, selectedProductId, isSelected, removeProduct}:Props) => {
  const [value,setValue]=useState<number>(newProduct.productMap.get(selectedProductId)!.quantity);


  useEffect(()=>{
      if(newProduct && newProduct.productMap)
        newProduct.productMap.get(selectedProductId)!.quantity=value;
      

      if(value){
        isSelected(selectedProductId,newProduct.productMap.get(selectedProductId)!);
      }
      else{
        removeProduct(selectedProductId);
      }
  },[value])

  useEffect(()=>{
    
    if(newProduct.productMap && newProduct.productMap.get(selectedProductId))
      setValue(newProduct.productMap.get(selectedProductId)!.quantity);
  },[selectedProductId]);


  return (
    <>
      {value ? (
        <div
          className="md:w-[8.125rem] md:h-[37.5px] w-24 flex border border-custom-red"
        >
          <div
            className="h-[36px] w-[28px] bg-custom-red bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={()=>{
              setValue(value-1);
          }}
          >
            <button className="text-custom-red">-</button>
          </div>
          <div className="w-[74px] flex justify-center items-center ">
          <input
            type="number"
            className="w-full h-full text-center outline-none text-custom-red"
            onChange={(e)=>{

                if(e.target.value===""){
                  setValue(0);
                }
                else{
                  setValue(parseInt(e.target.value));
                }
              }}
            value={value}
          />
        </div>
          <div
            className="h-[36px] w-[28px] bg-custom-red bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              setValue(value+1);
            }}
          >
            <div className="text-custom-red">+</div>
          </div>
        </div>
        
      ) : (
        <button
          onClick={() => {
              setValue(value+1);
          }}
          className="md:w-[8.125rem] md:h-[37.5px]  bg-custom-red text-white border text-xs md:text-base px-4 ml-1 mr-1 h-9 w-24 flex items-center justify-center"
        >
          Add
        </button>
      )}
    </>
  );
};

export default QuantityButton;

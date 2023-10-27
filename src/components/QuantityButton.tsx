import { MasterProduct } from "@/types/masterProduct";
import { Product } from "@/types/product";
import React, { useEffect, useState } from "react";

interface Props{
  newProduct:MasterProduct,
  selectedProductId:string,
  dbProductIDs: string[]
  isSelected: (productId: string, product: Product) => void
  removeProduct: (productId: string) => void
}

const QuantityButton = ({newProduct, selectedProductId, isSelected, removeProduct, dbProductIDs}:Props) => {
  const [value,setValue]=useState<number | undefined>(newProduct.productMap.get(selectedProductId)!.quantity);


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
      {value || value===undefined ? (
        // undefined is allowed but 0 is not allowed
        <div
          className="md:w-[8.125rem] md:h-[37.5px] w-24 flex border border-custom-red"
        >
          <div
            className="h-[36px] w-[28px] bg-custom-red bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={()=>{
            if(typeof(value)=== "number")
              setValue(value-1);
          }}
          >
            <div className="text-custom-red">-</div>
          </div>
          <div className="w-[74px] flex justify-center items-center ">
          <input
            type="number"
            className="w-full h-full text-center outline-none text-custom-red"
            onChange={(e)=>{

                if(!e.target.value){
                  setValue(undefined);
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
              if(typeof(value)=== "number")
                setValue(value+1);
            }}
          >
            <div className="text-custom-red">+</div>
          </div>
        </div>
        
      ) : (
        <div
          onClick={() => {
            if(dbProductIDs.includes(selectedProductId)){
              alert("This product is already a part of an active procurement. Hence, cannot be added")
              return;
            }
            if(typeof(value)=== "number")
              setValue(value+1);
          }}
          className="md:w-[8.125rem] md:h-[37.5px]  bg-custom-red text-white border text-xs md:text-base px-4 ml-1 mr-1 h-9 w-24 flex items-center justify-center cursor-pointer"
        >
          Add
        </div>
      )}
    </>
  );
};

export default QuantityButton;

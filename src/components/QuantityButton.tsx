import { MasterProduct } from "@/types/masterProduct";
import React, { useEffect, useState } from "react";

interface Props{
  product:MasterProduct,
  selectedProductId:string,
  updateQuantity:(value: number) => void
}

const QuantityButton = ({product, selectedProductId, updateQuantity}:Props) => {
  const [value,setValue]=useState<number>(0);
  
  useEffect(()=>{
    updateQuantity(value);
  },[value])

  useEffect(()=>{
    if(product.productQuantityMap){
      setValue(Number(product.productQuantityMap.get(selectedProductId)));
    }
  },[selectedProductId]);

  // useEffect(()=>{
  //   if(product.quantity)
  //     setValue(product.quantity);
  // },[product]);

  return (
    <>
      {value ? (
        <div
          className="w-[8.125rem] h-[37.5px] flex border border-custom-red"
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
          className="bg-custom-red text-white border text-xs md:text-base px-4 ml-1 mr-1 h-9 w-28 flex items-center justify-center"
        >
          Add
        </button>
      )}
    </>
  );
};

export default QuantityButton;

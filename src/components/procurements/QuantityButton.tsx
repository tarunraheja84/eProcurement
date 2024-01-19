import {  DbProductsDataContext } from "@/contexts/DbProductsDataContext";
import { SelectedProductsContext } from "@/contexts/SelectedProductsContext";
import { MasterProduct } from "@/types/masterProduct";
import { Product } from "@/types/product";
import React, { useContext, useEffect, useState } from "react";

interface Props{
  masterProduct:MasterProduct,
  selectedProductId:string,
}

const QuantityButton = ({masterProduct, selectedProductId}:Props) => {
  const [value,setValue]=useState<number | undefined>(masterProduct.productMap.get(selectedProductId)!.quantity);
  const {selectedProducts, setSelectedProducts} = useContext(SelectedProductsContext);
  const {dbProductsData}= useContext(DbProductsDataContext);

  const selectProduct = (productId: string, product: Product) => {
    selectedProducts.set(productId, product);
    setSelectedProducts(new Map(selectedProducts));
};

  const removeProduct = (productId: string) => {
    if (selectedProducts.has(productId)) {
      selectedProducts.delete(productId);
      setSelectedProducts(new Map(selectedProducts));
    }
  };

  useEffect(()=>{
      if(masterProduct && masterProduct.productMap)
        masterProduct.productMap.get(selectedProductId)!.quantity=value;

        if(value){
          selectProduct(selectedProductId,masterProduct.productMap.get(selectedProductId)!);
        }
        else{
          removeProduct(selectedProductId);
        }
  },[value])


  useEffect(()=>{  
    if(masterProduct.productMap && masterProduct.productMap.get(selectedProductId))
      setValue(masterProduct.productMap.get(selectedProductId)!.quantity);
  },[selectedProductId]);


  return (
    <>
      {value || value===undefined ? (
        // undefined is allowed but 0 is not allowed
        <div
          className="md:w-32 h-9 mx-2 my-2 md:my-0 flex border border-custom-theme"
        >
          <div
            className="h-9 w-8 bg-custom-theme bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={()=>{
            if(typeof(value)=== "number")
              setValue(value-1);
          }}
          >
            <div className="text-custom-theme">-</div>
          </div>
          <div className="w-20 flex justify-center items-center ">
          <input
            type="number"
            className="w-full h-full text-center outline-none text-custom-theme"
            onChange={(e)=>{

                if(!e.target.value){
                  setValue(undefined);
                }
                else{
                  setValue(Number(e.target.value));
                }
              }}
            value={value}
          />
        </div>
          <div
            className="h-9 w-8 bg-custom-theme bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              if(typeof(value)=== "number")
                setValue(value+1);
            }}
          >
            <div className="text-custom-theme">+</div>
          </div>
        </div>
        
      ) : (
        <div
          onClick={() => {
            for(const productData of dbProductsData){
              if(selectedProductId in productData.productsQuantity){
                const flag=confirm("This product is already a part of an active procurement plan. Please try different Pack Size. Click OK to view that plan in a new tab.")
                if(flag){
                  window.open(`/procurements/${productData.procurementId}/view`, "_blank");
                }
                return;
              }
            }
            if(typeof(value)=== "number")
              setValue(value+1);
          }}
          className="md:w-32 h-9 mx-2 my-2 md:my-0 flex border border-custom-theme bg-custom-theme text-white text-xs md:text-base items-center justify-center cursor-pointer"
        >
          Add
        </div>
      )}
    </>
  );
};

export default QuantityButton;

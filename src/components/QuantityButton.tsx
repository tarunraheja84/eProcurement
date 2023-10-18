import React, { useState } from "react";

const QuantityButton = ({product}:any) => {
  const [value,setValue]=useState(0);
  const handleQuantity=(e:any)=>{
    console.log(e.target.value)
    setValue(e.target.value);
  }
  return (
    <>
      {value ? (
        <div
          className="w-[8.125rem] h-[37.5px] flex"
          style={{ border: '1px solid #EC3A45' }}
        >
          <div
            className="h-[36px] w-[28px] bg-[#EC3A45] bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={()=>{
              setValue(value-1);
          }}
          >
            <button className="text-red-700">-</button>
          </div>
          <div className="w-[74px] flex justify-center items-center ">
          <input
            type="number"
            className="w-full h-full text-center outline-none text-red-700"
            onChange={(e)=>{setValue(parseInt(e.target.value))}}
            value={value}
            defaultValue={value}
          />
        </div>
          <div
            className="h-[36px] w-[28px] bg-[#EC3A45] bg-opacity-50 flex justify-center items-center hover:cursor-pointer"
            onClick={() => {
              setValue(value+1);
            }}
          >
            <div className="text-red-700">+</div>
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

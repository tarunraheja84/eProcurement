"use client"
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { VolumeDuration } from '@/types/enums';
import { Procurement } from '@/types/procurement';
import { Product } from '@/types/product';
import { Button } from 'primereact/button';
import Image from 'next/image';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import SelectedProducts from './selectedProducts';
import ProductSelectionPopup from './ProductSelectionPopup';

interface Props {
  procurement: any
  products: any
  // data coming from db has to defined any as it may or may not include all fields related to the type
  productIdQuantityArray: any
}

interface Manager {
  name: String
  email: String
}

const ViewProcurement = ({ procurement, products, productIdQuantityArray }: Props) => {
  const { selectedProducts } = useContext(SelectedProductsContext);
  const [editMode, setEditMode] = useState(false);
  const [isAddProductsPopupOpen, setAddProductsPopupOpen] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [planName, setPlanName] = useState(procurement.procurementName);
  const [volumeDuration, setVolumeDuration] = useState("weekly");
  const [approver, setApprover] = useState(procurement.requestedTo);
  const { data: session } = useSession();
  const toggleAddProductsPopup = () => {
    setAddProductsPopupOpen(!isAddProductsPopupOpen);
  };

  const handleName = (e: any) => {
    setPlanName(e.target.value);
  }

  const handleVolumeDuration = (e: any) => {
    setVolumeDuration(e.target.value)
  }

  const handleApprover = async (e: any) => {
    setApprover(e.target.value)
  }

  function convertToEnINDateTime(timestamp: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short',
      timeZone: 'Asia/Kolkata', // Set the desired time zone for India (en-IN)
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-IN', options);

    return formattedDate;
  }

  const showEditMode=()=>{
      setEditMode(true);
      (async () => {
        const result = await axios.get("/api/fetch_from_db/fetch_dbInternalUsers");
        setManagers(result.data);
      })();

      for(const product of products){
        product.quantity=productIdQuantityArray.filter((productQuantityObject: any) => productQuantityObject.productId === product.productId)[0].quantity;
        selectedProducts.set(product.productId, product)
      }
  }

  const savePlan=async (e:any)=>{
    e.preventDefault()
    alert("Tarun, Please talk about database changes first")
    // let userMail;
    // if (session && session.user)
    //     userMail=session.user.email
      
    //     const productsArray=Array.from(selectedProducts.values())

    //     const procurementPlan={
    //       procurementName:planName,
    //       createdBy:procurement.createdBy,
    //       updatedBy:userMail,
    //       requestedTo:approver,
    //       confirmedBy:"",
    //       volumeDuration:volumeDuration,
    //     }


    //     try {
    //       const result=await axios.get("/api/fetch_from_db/fetch_dbProcurements");
    //       const dbProcurementNames=[];
    //       for(const procurement of result.data){
    //         dbProcurementNames.push(procurement.procurementName)
    //       }
    //       if(dbProcurementNames.includes(planName) && planName!==procurement.procurementName){
    //         alert("There is already a Procurement Plan with this name, please change Plan name")
    //         return;
    //       }
          
    //       await axios.post("/api/procurements/update", {procurementPlan, productsArray});
    //       alert('Procurement Plan Updated successfully.');
    //       window.location.reload();
      // } catch (error: any) {
      //     console.log(error.message);
      //     alert(error.message)
      // }
  }


  return (
    <>
    <form onSubmit={savePlan}>
      {!editMode && <div className="flex justify-end items-center pb-4">
        <Button className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white outline-none" onClick={showEditMode}>Edit<span className="hidden md:inline-block">&nbsp;Procurement</span></Button>
      </div>}

      <div className="h-full flex flex-col justify-between">

        {editMode && <div>
          <h1 className="text-2xl font-bold text-custom-red mb-4">Edit Procurement</h1>
              <hr className="border-custom-red border mb-4" />
          <div className="mb-4">
            <label className="block font-bold text-sm mb-2" htmlFor="planName">
              Plan Name<span className="text-custom-red text-xs">*</span>
            </label>
            <input
              className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
              type="text"
              onChange={handleName}
              placeholder="Enter Plan Name"
              defaultValue={planName}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-sm mb-2" htmlFor="approver">
              Volume Duration
            </label>
            <select
              className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
              placeholder="Select Volume Duration"
              onChange={handleVolumeDuration}
              defaultValue={volumeDuration}
            >
              <option value={VolumeDuration.weekly}>weekly</option>
              <option value={VolumeDuration.daily}>daily</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold text-sm mb-2" htmlFor="approver">
              Select Approver
            </label>
            <select
              className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
              onChange={handleApprover}
              placeholder="Select Approver"
              value={approver}
            >
              <option value={approver}>{approver}</option>
              {
                managers && managers.filter((manager)=>manager.name!==approver).map((manager, index) => (
                  <option key={index} value={`${manager.email}`}>{manager.name}</option>)
                )
              }
            </select>
          </div>
          <div
            className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 mb-4 md:w-1/3 mx-auto text-center cursor-pointer"
            onClick={toggleAddProductsPopup}
          >
            Add Products
          </div>
        </div>}

        {!editMode && <div className="p-4 rounded-lg flex flex-col justify-between md:flex-row">
          <div className="">
            <div className="mb-2">
              <span className="font-bold">Procurement Name:</span> {procurement.procurementName}
            </div>
            <div className="mb-2">
              <span className="font-bold">Requested To:</span> {procurement.requestedTo}
            </div>
            <div className="mb-2">
              <span className="font-bold">Confirmed By:</span> {procurement.confirmedBy}
            </div>
            <div className="mb-2">
              <span className="font-bold">Status:</span> {procurement.status}
            </div>
            <div className="mb-2">
              <span className="font-bold">Volume Duration:</span> {procurement.volumeDuration}
            </div>
          </div>
          <div className="">
            <div className="mb-2">
              <span className="font-bold">Created By:</span> {procurement.createdBy}
            </div>
            <div className="mb-2">
              <span className="font-bold">Created At:</span> {convertToEnINDateTime(procurement.createdAt)}
            </div>
            <div className="mb-2">
              <span className="font-bold">Updated By:</span> {procurement.updatedBy}
            </div>
            <div className="mb-2">
              <span className="font-bold">Updated At:</span> {convertToEnINDateTime(procurement.updatedAt)}
            </div>
          </div>
        </div>}



        {!editMode && 
        <>
        <div>
          <div className={`flex flex-col md:flex-row justify-between`}>
            <h2 className="md:text-2xl mb-4">Selected Products</h2>
            <div className="text-sm md:text-base">Total Products Selected: {products.length}</div>
          </div>
        </div>
        <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
          {
            products.map((product: Product, index: number) => {
              const productQuantity=productIdQuantityArray.filter((productQuantityObject: any) => productQuantityObject.productId === product.productId)[0].quantity;

              return <div key={index} className='relative flex flex-col bg-white m-2 border rounded border-gray-400'>
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
                    </div>
                  </div>
                  <div className="md:absolute m-2 top-0 right-0 cursor-pointer">
                    ₹{product.sellingPrice}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row m-2">
                  <div className='border md:w-[145px] flex justify-center items-center pl-[10px] rounded-md focus:outline-none w-full' >
                    {product.packSize}
                  </div>
                  <div className='flex flex-row md:justify-end mt-2 md:mt-0 mx-2'>
                    <span>Quantity: {productQuantity}</span>
                  </div>
                </div>
              </div>
            }
            )
          }
        </div>
        </>}
          {editMode && <SelectedProducts/>}
          {isAddProductsPopupOpen && <ProductSelectionPopup toggleAddProductsPopup={toggleAddProductsPopup}/>}
          {selectedProducts.size>0 && <button
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3  mx-auto"
                type="submit"
              >
                Save Plan
              </button>}
      </div>
      </form>
    </>
  );
}

export default ViewProcurement






"use client"
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { ProcurementStatus, UserRole } from '@prisma/client';
import { convertDateTime } from './helperFunctions';
import { UserSession } from '@/types/userSession';
import Loading from '@/app/loading';


const ViewProcurement = ({procurement}: any) => {
  const {setSelectedProducts}= useContext(SelectedProductsContext);
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const session : UserSession | undefined = useSession().data?.user;
  let userMail: string, userName: string, userRole: string;
  if (session) {
    if (session.email)
      userMail = session.email
    if (session.name)
      userName = session.name
    if (session.role)
      userRole = session.role
  }


  // buttons and their permissions
  const markActivePermissions=()=>{
    return procurement.status===ProcurementStatus.AWAITING_APPROVAL  && procurement.requestedTo===userName;
  }
  const markInActivePermissions=()=>{
    return procurement.status===ProcurementStatus.ACTIVE && userRole===UserRole.MANAGER;
  }
  const duplicatePlanPermissions=()=>{
    return procurement.status!==ProcurementStatus.DRAFT && procurement.status!==ProcurementStatus.AWAITING_APPROVAL;
  }
  const editProcurementPermissions=()=>{
    return (procurement.status===ProcurementStatus.DRAFT || (procurement.status===ProcurementStatus.AWAITING_APPROVAL && (userRole===UserRole.MANAGER || procurement.createdBy===userMail)))
  }
  const createQuoteRequestPermissions=()=>{
    return procurement.status===ProcurementStatus.ACTIVE
  }

  useEffect(()=>{
    setSelectedProducts(new Map());
  },[])


  const markInactive=async ()=>{
    const flag=confirm("Do you really want to mark this plan as inactive?");
    if(!flag) return;

    setLoading(true);
    await axios.patch("/api/procurements", {procurementPlan:{status:ProcurementStatus.INACTIVE, updatedBy:userMail, confirmedBy:"", 
    requestedTo:""}, procurementId:procurement.procurementId});
    setLoading(false);
    window.open("/procurements?q=all_procurements", "_self")
  }

  const markActive=async ()=>{
    const flag=confirm("Do you really want to mark this plan as active?");
    if(!flag) return;

    setLoading(true);
    await axios.patch("/api/procurements", {procurementPlan:{status:ProcurementStatus.ACTIVE, updatedBy:userMail, confirmedBy:userName, requestedTo:""}, procurementId:procurement.procurementId});
    setLoading(false);
    window.open("/procurements?q=all_procurements", "_self")  
  }

  
  return (<>
    {loading ?
    < Loading/>:
    <> 
    <h1 className="text-2xl font-bold text-custom-red mb-4">Procurement Details</h1>
    <hr className="border-custom-red border mb-4" />   
      {/* buttons & their permissions */}
      <div className="flex gap-2 justify-end">

      {markInActivePermissions() && <div className="flex items-center pb-4">
        <div className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={markInactive}>Mark Inactive</div></div>
      }
      {markActivePermissions() && <div className="flex items-center pb-4">
        <div className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={markActive}>Mark Active</div></div>
      }

      {duplicatePlanPermissions() && <div className="flex items-center pb-4">
        <div className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={()=>{
          const flag=confirm("Are you sure?");
          if(!flag) return;
          router.push(`/procurements/${procurement.procurementId}/edit?duplicate=${true}`)}}>Duplicate Plan</div></div>
      }

      {editProcurementPermissions() && <div className="flex items-center pb-4">
        <div className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={()=>{
          const flag=confirm("Are you sure?");
          if(!flag) return;
          router.push(`/procurements/${procurement.procurementId}/edit`)}}>Edit<span className="hidden md:inline-block">&nbsp;Procurement</span></div>
      </div>}

      {createQuoteRequestPermissions() && <div className="flex items-center pb-4">
        <div className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={() => {router.push("/quotations/create")}}>Create Quote Request</div></div>
      }

    </div>

      <div className="h-full flex flex-col justify-between">

        <div className="p-4 rounded-lg flex flex-col justify-between md:flex-row">
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
              <span className="font-bold">Created At:</span> {convertDateTime(procurement.createdAt.toString())}
            </div>
            <div className="mb-2">
              <span className="font-bold">Updated By:</span> {procurement.updatedBy}
            </div>
            <div className="mb-2">
              <span className="font-bold">Updated At:</span> {convertDateTime(procurement.updatedAt.toString())}
            </div>
          </div>
        </div>

        <div>
          <div className={`flex flex-col md:flex-row justify-between`}>
            <h2 className="md:text-2xl mb-4">Selected Products</h2>
            <div className="text-sm md:text-base">Total Products Selected: {procurement.products!.length}</div>
          </div>
        </div>
        <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
          {
            procurement.products && procurement.products.map((product: Product, index: number) => {
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
                    <span>Quantity: {procurement.productsQuantity[product.productId]}</span>
                  </div>
                </div>
              </div>
            }
            )
          }
        </div>
      </div>
    </>}
    </>
  );
}

export default ViewProcurement






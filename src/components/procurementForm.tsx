"use client"
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { InternalUser, ProcurementStatus, UserRole, UserStatus, VolumeDuration } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react'
import SelectedProducts from './SelectedProducts';
import ProductSelectionPopup from './ProductSelectionPopup';
import Loading from '@/app/loading';
import { UserSession } from '@/types/userSession';

type ProcurementData = {
  procurementName: string,
  volumeDuration: VolumeDuration,
  status: ProcurementStatus,
  approver: string,
}

type Props = {
  procurement?: any,
  context?: any
}
const ProcurementForm = ({ procurement, context }: Props) => {
  const [isAddProductsPopupOpen, setAddProductsPopupOpen] = useState(false);
  const [procurementData, setProcurementsData] = useState<ProcurementData>({
    procurementName: procurement && procurement.procurementName ? procurement.procurementName : "",
    volumeDuration: VolumeDuration.weekly,
    status: ProcurementStatus.DRAFT,
    approver: procurement && procurement.requestedTo ? procurement.requestedTo : "",
  })
  const [ managers, setManagers ] = useState<InternalUser[]>();
  const { selectedProducts, setSelectedProducts } = useContext(SelectedProductsContext);
  const [duplicatePlan, setDuplicatePlan] = useState(false);
  const [loading, setLoading]= useState(false);
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

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setProcurementsData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const toggleAddProductsPopup = () => {
    setAddProductsPopupOpen(!isAddProductsPopupOpen);
  };

  useEffect(() => {
    if (procurement) {
      if (context && context.searchParams && context.searchParams.duplicate) {
        setDuplicatePlan(true);
        for (const product of procurement.products!) {
          product.quantity = procurement.productsQuantity[product.productId];
          delete product.procurementIds;
          delete product.id;
          setSelectedProducts(new Map(selectedProducts.set(product.productId, product)))
        }
      }
      else {
        setDuplicatePlan(false);
        for (const product of procurement.products!) {
          product.quantity = procurement.productsQuantity[product.productId];
          delete product.procurementIds;
          setSelectedProducts(new Map(selectedProducts.set(product.productId, product)))
        }
      }
    }
    else{
      setSelectedProducts(new Map());
    }

      (async () => {
        const result = await axios.get(`/api/users?role=${UserRole.MANAGER}&status=${UserStatus.ACTIVE}`);
        setManagers(result.data);
      })();

  }, [])

  const savePlan = async (e: any) => {
    e.preventDefault()

    const flag = confirm("Are you sure?");
    if (!flag) return;

    if (procurementData.approver === "" && procurementData.status !== ProcurementStatus.DRAFT) {
      alert("You have to send this plan to be approved by someone, please select Approver");
      return;
    }

    const productsArray = Array.from(selectedProducts.values())
    let productsQuantity: { [key: string]: number | undefined } = {};


    for (const product of productsArray) {
      productsQuantity[product.productId] = product.quantity;
      if(!product.taxes) delete product.taxes;
    }

    let procurementPlan;
    if(procurement){
      procurementPlan = {
        procurementName: procurementData.procurementName,
        createdBy: duplicatePlan ? userMail : procurement.createdBy,
        updatedBy: duplicatePlan ? "" : userMail,
        requestedTo: procurementData.approver,
        status: procurementData.status,
        confirmedBy: "",
        volumeDuration: procurementData.volumeDuration,
        products: duplicatePlan ? {
          create: productsArray
        } : {
          delete: procurement.products,
          create: productsArray,
        },
        productsQuantity: productsQuantity
      }
    }
    else{
      procurementPlan = {
        procurementName: procurementData.procurementName,
        createdBy: userMail,
        updatedBy: userMail,
        requestedTo: procurementData.approver,
        status: procurementData.status,
        confirmedBy: "",
        volumeDuration: procurementData.volumeDuration,
        products: {
          create: productsArray
        },
        productsQuantity: productsQuantity
      }
    }


    try {
      if (procurement && !duplicatePlan) {
        setLoading(true);
        const result = await axios.patch("/api/procurements", {procurementPlan, procurementId:procurement.procurementId});
        setLoading(false);
        if (result.data.error && result.data.error.meta.target === "Procurement_procurementName_key") {
          alert("There is already a Procurement Plan with this name, please change Plan name")
          return;
        }
        alert('Procurement Plan updated successfully.');
      }
      else { 
        setLoading(true);
        const result = await axios.post("/api/procurements", procurementPlan);
        setLoading(false);
        if (result.data.error && result.data.error.meta.target === "Procurement_procurementName_key") {
          alert("There is already a Procurement Plan with this name, please change Plan name")
          return;
        }
        alert('Procurement Plan created successfully.');
      }
      
      if (procurementData.status === ProcurementStatus.DRAFT)
        window.open("/procurements/my_procurements", "_self")
      else
        window.open("/procurements/all_procurements", "_self")
    } catch (error: any) {
      console.log('error  :>> ', error);
      alert(error.message)
    }
  }

  return (<>
  {loading ? <Loading/>:
    <form onSubmit={savePlan}>

      <div className="h-full flex flex-col justify-between">

        <div>
          {procurement? duplicatePlan ?
            <h1 className="text-2xl font-bold text-custom-red mb-4">Duplicate Procurement</h1> :
            <h1 className="text-2xl font-bold text-custom-red mb-4">Edit Procurement</h1>:
            <h1 className="text-2xl font-bold text-custom-red mb-4">Create Procurement</h1>
          }
          <hr className="border-custom-red border mb-4" />
          <div className="mb-4">
            <label className="block font-bold text-sm mb-2" htmlFor="planName">
              Plan Name<span className="text-custom-red text-xs">*</span>
            </label>
            <input
              className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
              type="text"
              id="procurementName"
              onChange={handleChange}
              placeholder="Enter Plan Name"
              defaultValue={procurementData.procurementName}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-sm mb-2" htmlFor="approver">
              Volume Duration
            </label>
            <select
              className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
              id="volumeDuration"
              placeholder="Select Volume Duration"
              onChange={handleChange}
              defaultValue={procurementData.volumeDuration}
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
              id="approver"
              onChange={handleChange}
              placeholder="Select Approver"
              value={procurementData.approver}
            >
              <option value={procurementData.approver}>{procurementData.approver}</option>
              {
                managers && managers.filter((manager) => manager.name !== procurementData.approver).map((manager, index) => (
                  <option key={index} value={`${manager.name}`}>{manager.name}</option>)
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
        </div>

        <SelectedProducts />
        {isAddProductsPopupOpen && <ProductSelectionPopup toggleAddProductsPopup={toggleAddProductsPopup} />}
        {selectedProducts.size>0 && <div className="md:flex">
          <button
            className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3 mx-auto"
            onClick={() => {
              setProcurementsData((prevData) => ({
                ...prevData,
                status: ProcurementStatus.DRAFT
              }))
            }}
            type="submit"
          >
            {procurement && procurement.status === ProcurementStatus.DRAFT ? "Update Draft" : "Save as Draft"}
          </button>
          <button
            className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0"
            onClick={() => {
              setProcurementsData((prevData) => ({
                ...prevData,
                status: ProcurementStatus.AWAITING_APPROVAL
              }))
            }}
            type="submit"
          >
            Send Plan for Approval
          </button>
        </div>}
      </div>
    </form>}
    </>
  )
}

export default ProcurementForm

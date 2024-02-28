"use client"
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { InternalUser, ProcurementStatus, UserRole, UserStatus, VolumeDuration } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react'
import SelectedProducts from './SelectedProducts';
import ProductSelectionPopup from './ProductSelectionPopup';
import { GetPermissions } from '@/utils/helperFrontendFunctions';
import AccessDenied from '@/app/access_denied/page';
import Loading from '@/app/loading';

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
  const [approvers, setApprovers] = useState<InternalUser[]>();
  const { selectedProducts, setSelectedProducts } = useContext(SelectedProductsContext);
  const [duplicatePlan, setDuplicatePlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userEmailId = session?.user?.email

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
          product.quantity = procurement.productsQuantity[product.sellerProductId];
          delete product.procurementIds;
          delete product.id;
          setSelectedProducts(new Map(selectedProducts.set(product.sellerProductId, product)))
        }
      }
      else {
        setDuplicatePlan(false);
        for (const product of procurement.products!) {
          product.quantity = procurement.productsQuantity[product.sellerProductId];
          delete product.procurementIds;
          setSelectedProducts(new Map(selectedProducts.set(product.sellerProductId, product)))
        }
      }
    }
    else {
      setSelectedProducts(new Map());
    }

    (async () => {
      const result = await axios.get(`/api/users?role=${UserRole.ADMIN}&status=${UserStatus.ACTIVE}`);
      setApprovers(result.data);
    })();

  }, [])

  const createProcurement = async (e: any) => {
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
      productsQuantity[product.sellerProductId] = product.quantity;
      if (!product.taxes) delete product.taxes;
    }

    const procurementPlan = {
      procurementName: procurementData.procurementName,
      createdBy: userEmailId,
      updatedBy: userEmailId,
      requestedTo: procurementData.approver,
      status: procurementData.status,
      confirmedBy: "",
      volumeDuration: procurementData.volumeDuration,
      products: {
        create: productsArray
      },
      productsQuantity: productsQuantity
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/procurements", procurementPlan);
      if (result.data.error && result.data.error.meta.target === "Procurement_procurementName_key") {
        alert("There is already a Procurement Plan with this name, please change Plan name")
        return;
      }
      alert('Procurement Plan created successfully.');

      if (procurementData.status === ProcurementStatus.DRAFT)
        window.open("/procurements/my_procurements", "_self")
      else
        window.open("/procurements/all_procurements", "_self")
    }
    catch (error) {
      console.log('error  :>> ', error);
    }
    setLoading(false);
  }


  const updateProcurement = async (e: any) => {
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
      productsQuantity[product.sellerProductId] = product.quantity;
      if (!product.taxes) delete product.taxes;
    }

    const procurementPlan = {
      procurementName: procurementData.procurementName,
      createdBy: procurement.createdBy,
      updatedBy: userEmailId,
      requestedTo: procurementData.approver,
      status: procurementData.status,
      confirmedBy: "",
      volumeDuration: procurementData.volumeDuration,
      products: {
        delete: procurement.products,
        create: productsArray,
      },
      productsQuantity: productsQuantity
    }

    setLoading(true);
    try {
      const result = await axios.put("/api/procurements", { procurementPlan, procurementId: procurement.procurementId });
      setLoading(false);
      if (result.data.error && result.data.error.meta.target === "Procurement_procurementName_key") {
        alert("There is already a Procurement Plan with this name, please change Plan name")
        return;
      }
      alert('Procurement Plan updated successfully.');

      if (procurementData.status === ProcurementStatus.DRAFT)
        window.open("/procurements/my_procurements", "_self")
      else
        window.open("/procurements/all_procurements", "_self")
    }
    catch (error) {
      console.log('error  :>> ', error);
    }
  }


  const duplicateProcurement = async (e: any) => {
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
      productsQuantity[product.sellerProductId] = product.quantity;
      if (!product.taxes) delete product.taxes;
    }

    const procurementPlan = {
      procurementName: procurementData.procurementName,
      createdBy: userEmailId,
      updatedBy: userEmailId,
      requestedTo: procurementData.approver,
      status: procurementData.status,
      confirmedBy: "",
      volumeDuration: procurementData.volumeDuration,
      products: {
        create: productsArray
      },
      productsQuantity: productsQuantity
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/procurements", procurementPlan);
      setLoading(false);
      if (result.data.error && result.data.error.meta.target === "Procurement_procurementName_key") {
        alert("There is already a Procurement Plan with this name, please change Plan name")
        return;
      }
      alert('Procurement Plan created successfully.');

      if (procurementData.status === ProcurementStatus.DRAFT)
        window.open("/procurements/my_procurements", "_self")
      else
        window.open("/procurements/all_procurements", "_self")
    }
    catch (error) {
      console.log('error  :>> ', error);
    }
  }
  return (<>
    { GetPermissions("procurementPermissions","create") ?
      <form onSubmit={duplicatePlan ? duplicateProcurement : procurement ? updateProcurement : createProcurement}>
        {loading && <div className="absolute inset-0 z-10"><Loading /></div>}
        <div className="h-full flex flex-col justify-between">

          <div>
            {procurement ? duplicatePlan ?
              <h1 className="text-2xl font-bold text-custom-theme mb-4">Duplicate Procurement</h1> :
              <h1 className="text-2xl font-bold text-custom-theme mb-4">Edit Procurement</h1> :
              <h1 className="text-2xl font-bold text-custom-theme mb-4">Create Procurement</h1>
            }
            <hr className="border-custom-theme border mb-4" />
            <div className="mb-4">
              <label className="block font-bold text-sm mb-2" htmlFor="planName">
                Plan Name<span className="text-custom-theme text-xs">*</span>
              </label>
              <input
                className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
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
                className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
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
                className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
                id="approver"
                onChange={handleChange}
                placeholder="Select Approver"
                value={procurementData.approver}
              >
                <option value={procurementData.approver}>{procurementData.approver}</option>
                {
                  approvers && approvers.filter((approver) => approver.name !== procurementData.approver).map((approver, index) => (
                    <option key={index} value={`${approver.name}`}>{approver.name}</option>)
                  )
                }
              </select>
            </div>
            <div
              className="block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 mb-4 md:w-1/3 mx-auto text-center cursor-pointer"
              onClick={toggleAddProductsPopup}
            >
              Add Products
            </div>
          </div>

          <SelectedProducts />
          {isAddProductsPopupOpen && <ProductSelectionPopup toggleAddProductsPopup={toggleAddProductsPopup} />}
          {selectedProducts.size > 0 && <div className="md:flex">
            <button
              className="cursor-pointer block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto"
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
              className="cursor-pointer block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0"
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
      </form>:<AccessDenied />}
  </>
  )
}

export default ProcurementForm
